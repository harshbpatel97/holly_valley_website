const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory cache for images (you could use Redis or file system for production)
const imageCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Enable CORS for React app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());

// Google Drive API proxy endpoint
app.get('/api/googledrive/images', async (req, res) => {
  try {
    const folderId = req.query.folderId;
    const apiKey = req.query.apiKey || process.env.GOOGLE_DRIVE_API_KEY;
    
    if (!folderId) {
      return res.status(400).json({ error: 'Google Drive folder ID is required. Use ?folderId=YOUR_FOLDER_ID' });
    }
    
    if (!apiKey) {
      return res.status(400).json({ error: 'Google Drive API key is required. Set GOOGLE_DRIVE_API_KEY or pass ?apiKey=YOUR_KEY' });
    }

    console.log('Fetching Google Drive folder:', folderId);

    // Google Drive API v3 - List files in folder
    const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image'&fields=files(id,name,webContentLink,mimeType)&key=${apiKey}`;
    
    https.get(apiUrl, {
      headers: {
        'Accept': 'application/json',
      }
    }, (apiRes) => {
      let data = '';
      
      apiRes.on('data', (chunk) => {
        data += chunk;
      });
      
      apiRes.on('end', () => {
        if (apiRes.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            const imageFiles = json.files || [];
            
            const imageUrls = imageFiles
              .filter(file => {
                const mimeType = file.mimeType?.toLowerCase() || '';
                return mimeType.startsWith('image/');
              })
              .map(file => {
                if (file.webContentLink) {
                  return file.webContentLink.split('&export=')[0];
                }
                return `https://drive.google.com/uc?export=download&id=${file.id}`;
              })
              .filter(url => url && url.length > 0);
            
            if (imageUrls.length === 0) {
              return res.status(404).json({ error: 'No images found in Google Drive folder' });
            }
            
            console.log(`Successfully fetched ${imageUrls.length} image(s)`);
            res.json({ images: imageUrls });
          } catch (e) {
            res.status(500).json({ error: 'Failed to parse Google Drive response', message: e.message });
          }
        } else {
          res.status(apiRes.statusCode).json({ 
            error: 'Failed to fetch from Google Drive API',
            message: data.substring(0, 500)
          });
        }
      });
    }).on('error', (e) => {
      res.status(500).json({ error: 'Failed to fetch from Google Drive API', message: e.message });
    });

  } catch (error) {
    console.error('Error fetching Google Drive images:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Google Drive images',
      message: error.message
    });
  }
});

// Image proxy endpoint - fetches images from Google CDN and serves them with proper caching
// This avoids 429 rate limit errors by having the server handle CDN requests
app.get('/api/googledrive/proxy', (req, res) => {
  try {
    const imageUrl = req.query.url;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required. Use ?url=IMAGE_URL' });
    }

    // Check cache first
    const cached = imageCache.get(imageUrl);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      res.setHeader('Content-Type', cached.contentType || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours browser cache
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.send(cached.data);
    }

    // Fetch from Google CDN with proper headers
    const url = new URL(imageUrl);
    const protocol = url.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SignageServer/1.0)',
        'Referer': 'https://drive.google.com/',
      },
      timeout: 30000, // 30 second timeout
    };

    protocol.get(options, (imageRes) => {
      if (imageRes.statusCode === 429) {
        // Rate limited - return error with retry header
        return res.status(429).json({ 
          error: 'Rate limited by Google CDN',
          retryAfter: 10 
        });
      }

      if (imageRes.statusCode !== 200) {
        return res.status(imageRes.statusCode).json({ 
          error: 'Failed to fetch image',
          statusCode: imageRes.statusCode 
        });
      }

      const chunks = [];
      const contentType = imageRes.headers['content-type'] || 'image/jpeg';

      imageRes.on('data', (chunk) => {
        chunks.push(chunk);
      });

      imageRes.on('end', () => {
        const imageData = Buffer.concat(chunks);
        
        // Cache the image
        imageCache.set(imageUrl, {
          data: imageData,
          contentType: contentType,
          timestamp: Date.now(),
        });

        // Set proper headers for caching
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours browser cache
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(imageData);
      });
    }).on('error', (e) => {
      console.error('Error proxying image:', e);
      res.status(500).json({ 
        error: 'Failed to proxy image',
        message: e.message 
      });
    }).on('timeout', () => {
      res.status(504).json({ error: 'Image request timeout' });
    });

  } catch (error) {
    console.error('Error in image proxy:', error);
    res.status(500).json({ 
      error: 'Failed to proxy image',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Google Drive Proxy Server running on http://localhost:${PORT}`);
  console.log(`📡 Proxy endpoint: http://localhost:${PORT}/api/googledrive/images?folderId=YOUR_FOLDER_ID&apiKey=YOUR_KEY`);
});

