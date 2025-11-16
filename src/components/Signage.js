import React, { useState, useEffect } from 'react';
import { Box, Spinner, Text } from '@chakra-ui/react';
import './Signage.css';

const Signage = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get OneDrive link from environment variable
  const oneDriveLink = process.env.REACT_APP_ONEDRIVE_LINK;
  
  // Slide duration in milliseconds (default 5 seconds)
  const slideDuration = parseInt(process.env.REACT_APP_SIGNAGE_SLIDE_DURATION || '5000', 10);
  
  // Refresh interval in milliseconds (default: 24 hours = 86400000ms)
  // This checks for updated images from OneDrive once per day
  const refreshInterval = parseInt(process.env.REACT_APP_SIGNAGE_REFRESH_INTERVAL || '86400000', 10);

  useEffect(() => {
    if (!oneDriveLink) {
      setError('OneDrive link not configured. Please set REACT_APP_ONEDRIVE_LINK environment variable.');
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchImagesFromOneDrive(oneDriveLink, false);

    // Set up automatic refresh to pick up new/removed images
    const refreshTimer = setInterval(() => {
      console.log('Refreshing images from OneDrive...');
      fetchImagesFromOneDrive(oneDriveLink, true);
    }, refreshInterval);

    return () => clearInterval(refreshTimer);
  }, [oneDriveLink, refreshInterval]);

  useEffect(() => {
    if (images.length === 0) return;

    // Auto-advance slides
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, slideDuration);

    return () => clearInterval(interval);
  }, [images.length, slideDuration]);

  const fetchImagesFromOneDrive = async (link, isRefresh = false) => {
    try {
      // Only show loading state on initial load, not on refresh
      if (!isRefresh) {
        setLoading(true);
        setError(null);
      }

      console.log('Fetching images from OneDrive link:', link);

      // Convert OneDrive share link to direct access format
      const imageUrls = await convertOneDriveLinkToImageUrls(link);
      
      if (imageUrls.length === 0) {
        if (!isRefresh) {
          setError('No images found in the OneDrive folder.');
          setLoading(false);
        }
        return;
      }

      console.log(`Successfully loaded ${imageUrls.length} image(s)`);
      
      // Update images - React will handle re-rendering smoothly
      setImages(prevImages => {
        // If this is a refresh and images changed, we might want to preserve current slide
        // Otherwise, just update the images
        return imageUrls;
      });
      
      // Reset to first slide only if this is initial load or if current index is out of bounds
      setCurrentIndex(prevIndex => {
        if (prevIndex >= imageUrls.length) {
          return 0;
        }
        // Keep current slide on refresh if still valid
        return prevIndex;
      });
      
      if (!isRefresh) {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching images from OneDrive:', err);
      const errorMessage = err.message || 'Unknown error occurred';
      
      // Only show error on initial load to avoid disrupting slideshow
      if (!isRefresh) {
        setError(`Failed to load images: ${errorMessage}`);
        setLoading(false);
      } else {
        // On refresh errors, just log - don't disrupt the slideshow
        console.warn('Failed to refresh images (continuing with existing images):', errorMessage);
      }
    }
  };

  // Helper function to resolve OneDrive short link
  const resolveOneDriveShortLink = async (shortLink) => {
    try {
      // Use a simple GET request with redirect follow to resolve the link
      // Note: We use a no-cors mode might be needed, but let's try standard first
      const response = await fetch(shortLink, {
        method: 'GET',
        redirect: 'follow',
        mode: 'cors',
      });
      
      const finalUrl = response.url || response.redirected ? response.url : shortLink;
      console.log('Resolved short link to:', finalUrl);
      
      // Extract share ID from the resolved URL
      if (finalUrl.includes('onedrive.live.com')) {
        const match = finalUrl.match(/[?&](?:id|cid|resid)=([^&]+)/);
        if (match) {
          return match[1];
        }
      }
      
      return null;
    } catch (error) {
      console.warn('Failed to resolve short link:', error);
      // Fallback: Try to extract from location header if available
      return null;
    }
  };

  // Helper function to resolve short link to full URL
  const resolveOneDriveShortLinkToFull = async (shortLink) => {
    try {
      // Use GET request to follow redirects
      const response = await fetch(shortLink, {
        method: 'GET',
        redirect: 'follow',
        mode: 'cors',
      });
      
      // Check if we got redirected
      if (response.redirected && response.url) {
        console.log('Link was redirected from', shortLink, 'to', response.url);
        return response.url;
      }
      
      // Sometimes the final URL is in response.url even if redirected is false
      if (response.url && response.url !== shortLink) {
        return response.url;
      }
      
      // If fetch doesn't provide the redirect URL, try using an XMLHttpRequest approach
      // or return the original link
      return shortLink;
    } catch (error) {
      console.warn('Failed to resolve short link to full URL:', error);
      // If CORS blocks us, we'll need to try a different approach
      // For now, return null and let the API methods try directly
      return null;
    }
  };

  const convertOneDriveLinkToImageUrls = async (link) => {
    // Handle different OneDrive link formats
    // Format 1: https://1drv.ms/f/s!TOKEN or https://1drv.ms/u/s!TOKEN
    // Format 2: https://onedrive.live.com/?id=... or ...&id=...
    // Format 3: Direct JSON endpoint or folder ID
    // Format 4: https://1drv.ms/f/s!TOKEN?e=CODE

    try {
      // If link is already a JSON file with image URLs, fetch it directly
      if (link.endsWith('.json') || link.includes('.json?')) {
        const response = await fetch(link);
        if (!response.ok) throw new Error('Failed to fetch JSON');
        const data = await response.json();
        // Support different JSON structures
        if (Array.isArray(data)) {
          return data.map(item => typeof item === 'string' ? item : item.url || item.src);
        } else if (data.images && Array.isArray(data.images)) {
          return data.images.map(item => typeof item === 'string' ? item : item.url || item.src);
        }
        return [];
      }

      // Extract share token from OneDrive link
      let shareToken = null;
      let shareId = null;
      
      // Normalize the link - remove trailing slashes
      link = link.trim().replace(/\/$/, '');
      
      // Handle 1drv.ms format: https://1drv.ms/f/s!TOKEN or https://1drv.ms/u/s!TOKEN
      // Also handle: https://1drv.ms/f/s!TOKEN?e=CODE
      // Also handle: https://1drv.ms/f/c/ID1/ID2?e=CODE (folder format)
      if (link.includes('1drv.ms')) {
        // Try to extract token after /s! or /u! (standard share format)
        const match = link.match(/[su]\/s!([A-Za-z0-9_-]+)/);
        if (match) {
          shareToken = match[1];
        } else {
          // Handle /f/c/ format: https://1drv.ms/f/c/ID1/ID2?e=CODE
          const folderMatch = link.match(/\/f\/c\/([A-Za-z0-9]+)\/([A-Za-z0-9_-]+)/);
          if (folderMatch) {
            // Extract both IDs
            const folderId1 = folderMatch[1];
            const folderId2 = folderMatch[2];
            
            // For /f/c/ format, the share identifier is typically base64 encoded
            // The format might be: u!base64(combined-ids) or just base64(combined-ids)
            // Try different encoding approaches
            shareToken = folderId2; // Use the second part as potential share ID
            shareId = `${folderId1}/${folderId2}`;
            
            // Also try encoding the combined path for API access
            // OneDrive API often uses base64url encoding (replace + with -, / with _, remove =)
            const combinedId = `u!${folderId1}!${folderId2}`;
            const base64Encoded = btoa(combinedId).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
            
            // Try to resolve this format using the OneDrive API
            try {
              const resolvedShareId = await resolveOneDriveShortLink(link);
              if (resolvedShareId) {
                shareToken = resolvedShareId;
                shareId = resolvedShareId;
              } else {
                // If resolution fails, try using the base64 encoded version
                shareToken = base64Encoded;
                shareId = combinedId;
              }
            } catch (resolveError) {
              console.warn('Could not resolve short link, trying direct API access:', resolveError);
              // Use base64 encoded version as fallback
              shareToken = base64Encoded;
              shareId = combinedId;
            }
          } else {
            // Try alternative format without s!
            const altMatch = link.match(/1drv\.ms\/[fu]\/([A-Za-z0-9_-]+)/);
            if (altMatch) {
              shareToken = altMatch[1];
            }
          }
        }
      }
      // Handle onedrive.live.com format: https://onedrive.live.com/?id=... or ...&id=...
      // Or: https://onedrive.live.com/redir?resid=... or cid=...
      else if (link.includes('onedrive.live.com')) {
        try {
          const url = new URL(link);
          shareId = url.searchParams.get('id') || url.searchParams.get('cid') || url.searchParams.get('resid');
          
          // Try to extract from path as well
          if (!shareId) {
            const pathMatch = link.match(/[?&](?:id|cid|resid)=([^&]+)/);
            if (pathMatch) {
              shareId = pathMatch[1];
            }
          }
          
          if (shareId) {
            // Convert to share token format (base64 encoded)
            shareToken = shareId;
          }
        } catch (e) {
          // If URL parsing fails, try regex
          const match = link.match(/[?&](?:id|cid|resid)=([^&]+)/);
          if (match) {
            shareId = match[1];
            shareToken = shareId;
          }
        }
      }
      // Handle sharepoint.com links (OneDrive for Business)
      else if (link.includes('sharepoint.com')) {
        // Extract the sharing token from SharePoint links
        const match = link.match(/[?&]web=([^&]+)/);
        if (match) {
          shareToken = match[1];
        }
      }
      // If it's a direct folder ID or token, use it directly
      else if (link.match(/^[A-Za-z0-9_-]+$/)) {
        shareToken = link;
      }

      if (!shareToken && !shareId) {
        console.error('Failed to parse OneDrive link:', link);
        throw new Error(`Invalid OneDrive link format. Detected link: ${link.substring(0, 50)}... Please provide a valid OneDrive share link like:
- https://1drv.ms/f/s!TOKEN
- https://onedrive.live.com/?id=TOKEN`);
      }

      const tokenToUse = shareToken || shareId;

      // Method 1: Try OneDrive API using share token (base64 encoded format)
      try {
        // For /f/c/ format, try multiple encoding approaches
        let apiUrls = [];
        
        if (shareId && shareId.includes('/')) {
          // This is likely a folder ID from /f/c/ format
          const [id1, id2] = shareId.split('/');
          
          // Try different encoding formats that OneDrive might use
          // Format 1: base64url encode the combined path
          const encoded1 = btoa(shareId).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
          apiUrls.push(`https://api.onedrive.com/v1.0/shares/${encoded1}/root/children`);
          
          // Format 2: u! prefix with base64url encoding
          const combinedU = `u!${id1}!${id2}`;
          const encoded2 = btoa(combinedU).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
          apiUrls.push(`https://api.onedrive.com/v1.0/shares/${encoded2}/root/children`);
          
          // Format 3: Try with just the second ID
          apiUrls.push(`https://api.onedrive.com/v1.0/shares/${id2}/root/children`);
          
          // Format 4: Try base64 encoding the second ID
          const encodedId2 = btoa(id2).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
          apiUrls.push(`https://api.onedrive.com/v1.0/shares/${encodedId2}/root/children`);
        } else {
          apiUrls.push(`https://api.onedrive.com/v1.0/shares/${tokenToUse}/root/children`);
        }
        
        // Try each API URL until one works
        for (const apiUrl of apiUrls) {
          console.log('Trying OneDrive API URL:', apiUrl);
        
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('OneDrive API response:', data);
            
            // Filter for image files only (including .jpeg which was missing)
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.JPG', '.JPEG', '.PNG'];
            const imageItems = (data.value || []).filter(item => {
              const name = item.name?.toLowerCase() || '';
              return imageExtensions.some(ext => name.toLowerCase().endsWith(ext.toLowerCase()));
            });

            console.log(`Found ${imageItems.length} image(s) in folder`);

            // Extract direct download URLs
            const urls = imageItems.map(item => {
              // Use @content.downloadUrl for direct download
              if (item['@content.downloadUrl']) {
                return item['@content.downloadUrl'];
              }
              // Try @microsoft.graph.downloadUrl
              if (item['@microsoft.graph.downloadUrl']) {
                return item['@microsoft.graph.downloadUrl'];
              }
              // Fallback to webUrl (might need authentication)
              return item.webUrl || '';
            }).filter(url => url && url.length > 0);
            
            if (urls.length > 0) {
              return urls; // Success! Return the URLs
            }
          } else {
            console.warn(`OneDrive API returned status ${response.status} for ${apiUrl}`);
            // Try to get error details for debugging
            try {
              const errorData = await response.text();
              if (errorData.length < 500) { // Only log if not too long
                console.warn('API error response:', errorData);
              }
            } catch (e) {
              // Ignore error parsing errors
            }
            // Continue to next URL
          }
        }
      } catch (apiError) {
        console.warn('OneDrive API method failed, trying alternative:', apiError);
      }

      // Method 2: Try resolving the short link first, then accessing
      // Only do this if we haven't already resolved (prevent infinite recursion)
      if (link.includes('1drv.ms') && link.includes('/f/c/') && !link.includes('onedrive.live.com')) {
        try {
          // Try to resolve the short link by following redirects
          const resolvedLink = await resolveOneDriveShortLinkToFull(link);
          if (resolvedLink && resolvedLink !== link && resolvedLink.includes('onedrive.live.com')) {
            console.log('Resolved OneDrive link:', resolvedLink);
            // Extract share ID from resolved link
            try {
              const url = new URL(resolvedLink);
              const resolvedShareId = url.searchParams.get('id') || url.searchParams.get('cid') || url.searchParams.get('resid');
              if (resolvedShareId) {
                // Try API with resolved share ID
                const resolvedApiUrl = `https://api.onedrive.com/v1.0/shares/${resolvedShareId}/root/children`;
                console.log('Trying resolved API URL:', resolvedApiUrl);
                
                const resolvedResponse = await fetch(resolvedApiUrl, {
                  method: 'GET',
                  headers: {
                    'Accept': 'application/json',
                  },
                });
                
                if (resolvedResponse.ok) {
                  const resolvedData = await resolvedResponse.json();
                  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.JPG', '.JPEG', '.PNG'];
                  const imageItems = (resolvedData.value || []).filter(item => {
                    const name = item.name?.toLowerCase() || '';
                    return imageExtensions.some(ext => name.toLowerCase().endsWith(ext.toLowerCase()));
                  });

                  const urls = imageItems.map(item => {
                    if (item['@content.downloadUrl']) return item['@content.downloadUrl'];
                    if (item['@microsoft.graph.downloadUrl']) return item['@microsoft.graph.downloadUrl'];
                    return item.webUrl || '';
                  }).filter(url => url && url.length > 0);
                  
                  if (urls.length > 0) {
                    return urls;
                  }
                }
              }
            } catch (resolveExtractError) {
              console.warn('Failed to extract share ID from resolved link:', resolveExtractError);
            }
          }
        } catch (resolveError) {
          console.warn('Failed to resolve short link:', resolveError);
        }
      }

      // Method 3: Try alternative API endpoint format with encoded token
      try {
        // Try with base64 encoding
        const encodedToken = btoa(tokenToUse).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        const altApiUrl = `https://api.onedrive.com/v1.0/shares/${encodedToken}/root/children`;
        console.log('Trying alternative API URL:', altApiUrl);
        
        const response = await fetch(altApiUrl);
        
        if (response.ok) {
          const data = await response.json();
          const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.JPG', '.JPEG', '.PNG'];
          const imageItems = (data.value || []).filter(item => {
            const name = item.name?.toLowerCase() || '';
            return imageExtensions.some(ext => name.toLowerCase().endsWith(ext.toLowerCase()));
          });

          const urls = imageItems.map(item => {
            if (item['@content.downloadUrl']) return item['@content.downloadUrl'];
            if (item['@microsoft.graph.downloadUrl']) return item['@microsoft.graph.downloadUrl'];
            return item.webUrl || '';
          }).filter(url => url && url.length > 0);
          
          if (urls.length > 0) {
            return urls;
          }
        }
      } catch (altError) {
        console.warn('Alternative API method also failed:', altError);
      }

      // Method 4: Try Microsoft Graph API with URL-encoded share link
      // For /f/c/ format, Microsoft Graph API accepts the share URL by base64-encoding the entire URL
      try {
        if (link.includes('1drv.ms') && link.includes('/f/c/')) {
          // Base64 encode the entire share URL for Microsoft Graph API
          // The format is: shares/{encodedUrl}/root/children
          // where encodedUrl is base64url encoded (replace + with -, / with _, remove =)
          const encodedShareUrl = btoa(link).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
          const graphApiUrl = `https://graph.microsoft.com/v1.0/shares/${encodedShareUrl}/root/children`;
          console.log('Trying Microsoft Graph API with URL:', graphApiUrl);
          
          const response = await fetch(graphApiUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('Microsoft Graph API response:', data);
            
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.JPG', '.JPEG', '.PNG'];
            const imageItems = (data.value || []).filter(item => {
              const name = item.name?.toLowerCase() || '';
              return imageExtensions.some(ext => name.toLowerCase().endsWith(ext.toLowerCase()));
            });

            console.log(`Found ${imageItems.length} image(s) via Graph API`);

            const urls = imageItems.map(item => {
              // Try @microsoft.graph.downloadUrl first
              if (item['@microsoft.graph.downloadUrl']) {
                return item['@microsoft.graph.downloadUrl'];
              }
              // Fallback to @content.downloadUrl
              if (item['@content.downloadUrl']) {
                return item['@content.downloadUrl'];
              }
              // Last resort
              return '';
            }).filter(url => url && url.length > 0);
            
            if (urls.length > 0) {
              console.log('Successfully retrieved images via Microsoft Graph API');
              return urls;
            }
          } else {
            console.warn(`Microsoft Graph API returned status ${response.status}`);
            try {
              const errorData = await response.text();
              if (errorData.length < 500) {
                console.warn('Graph API error:', errorData);
              }
            } catch (e) {
              // Ignore
            }
          }
        }
      } catch (graphError) {
        console.warn('Microsoft Graph API method failed:', graphError);
      }
      
      // Method 5: Try OneDrive API with URL-encoded share link (same approach as Graph API)
      try {
        if (link.includes('1drv.ms') && link.includes('/f/c/')) {
          const encodedShareUrl = btoa(link).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
          const onedriveApiUrl = `https://api.onedrive.com/v1.0/shares/${encodedShareUrl}/root/children`;
          console.log('Trying OneDrive API with URL:', onedriveApiUrl);
          
          const response = await fetch(onedriveApiUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('OneDrive API response (URL method):', data);
            
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.JPG', '.JPEG', '.PNG'];
            const imageItems = (data.value || []).filter(item => {
              const name = item.name?.toLowerCase() || '';
              return imageExtensions.some(ext => name.toLowerCase().endsWith(ext.toLowerCase()));
            });

            const urls = imageItems.map(item => {
              if (item['@content.downloadUrl']) return item['@content.downloadUrl'];
              if (item['@microsoft.graph.downloadUrl']) return item['@microsoft.graph.downloadUrl'];
              return '';
            }).filter(url => url && url.length > 0);
            
            if (urls.length > 0) {
              return urls;
            }
          }
        }
      } catch (onedriveUrlError) {
        console.warn('OneDrive API (URL method) failed:', onedriveUrlError);
      }
      
      // If all API methods fail, provide helpful error message
      throw new Error(`Unable to access OneDrive folder automatically. 
      
Please ensure:
1. The OneDrive folder is shared publicly with "Anyone with the link" permission
2. The link format is correct (https://1drv.ms/f/s!TOKEN or similar)
3. Try creating a JSON file with your image URLs and use that instead.

Alternative solution: Create a JSON file (e.g., images.json) with this format:
["https://direct-image-url-1.jpg", "https://direct-image-url-2.jpg"]

Then use the JSON file URL in REACT_APP_ONEDRIVE_LINK instead of the OneDrive folder link.`);
      
    } catch (err) {
      console.error('Error converting OneDrive link:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        bg="black"
        color="white"
      >
        <Box textAlign="center">
          <Spinner size="xl" color="white" thickness="4px" mb={4} />
          <Text fontSize="xl">Loading images...</Text>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        bg="black"
        color="white"
        p={8}
      >
        <Box textAlign="center" maxW="800px">
          <Text fontSize="2xl" mb={4} color="red.400">Error</Text>
          <Text fontSize="lg">{error}</Text>
          <Text fontSize="sm" mt={4} color="gray.400">
            Please configure REACT_APP_ONEDRIVE_LINK with a valid OneDrive share link or JSON file URL.
          </Text>
        </Box>
      </Box>
    );
  }

  if (images.length === 0) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        bg="black"
        color="white"
      >
        <Text fontSize="xl">No images available</Text>
      </Box>
    );
  }

  return (
    <Box className="signage-container">
      {images.map((imageUrl, index) => (
        <Box
          key={index}
          className={`signage-slide ${index === currentIndex ? 'active' : ''}`}
        >
          <img
            src={imageUrl}
            alt={`Slide ${index + 1}`}
            className="signage-image"
            onError={(e) => {
              console.error(`Failed to load image ${index + 1}:`, imageUrl);
              // Hide broken images
              e.target.style.display = 'none';
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default Signage;

