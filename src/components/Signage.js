import React, { useState, useEffect, useRef } from 'react';
import { Box, Spinner, Text } from '@chakra-ui/react';
import './Signage.css';

const ActiveImageWithThrottle = ({ imageUrl, index, currentIndex, lastImageLoadTime, setLastImageLoadTime, onLoad }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef(null);
  const prevImageUrlRef = useRef(null);
  const prevCurrentIndexRef = useRef(null);

  useEffect(() => {
    const isSameImage = imageUrl === prevImageUrlRef.current && currentIndex === prevCurrentIndexRef.current;
    prevImageUrlRef.current = imageUrl;
    prevCurrentIndexRef.current = currentIndex;
    
    if (isSameImage && shouldLoad) {
      return;
    }
    
    if (!isSameImage) {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      setRetryCount(0);
      setShouldLoad(false);
    }

    const timeSinceLastLoad = lastImageLoadTime > 0 ? Date.now() - lastImageLoadTime : 999999;
    const minDelay = 5000;
    const delay = lastImageLoadTime > 0 ? Math.max(0, minDelay - timeSinceLastLoad) : 0;

    const loadTimer = setTimeout(() => {
      setShouldLoad(true);
      setLastImageLoadTime(Date.now());
    }, delay);

    return () => clearTimeout(loadTimer);
  }, [currentIndex, imageUrl, lastImageLoadTime, setLastImageLoadTime, shouldLoad, index]);

  const handleError = (e) => {
    if (retryCount < 3) {
      const retryDelay = Math.pow(2, retryCount + 1) * 5000;
      retryTimeoutRef.current = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setShouldLoad(true);
        setLastImageLoadTime(Date.now());
      }, retryDelay);
    } else {
      e.target.style.display = 'none';
      onLoad();
    }
  };

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);


  if (!shouldLoad) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        bg="black"
      />
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      bg="black"
    >
      <img
        key={`image-${index}`}
        src={imageUrl}
        alt={`Slide ${index + 1}`}
        className="signage-image"
        loading="eager"
        referrerPolicy="no-referrer"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
          margin: 'auto'
        }}
        onError={handleError}
        onLoad={(e) => {
          setRetryCount(0);
          onLoad();
        }}
        ref={(imgElement) => {
          if (!imgElement) return;
          
          setTimeout(() => {
            if (imgElement.complete && imgElement.naturalHeight > 0) {
              onLoad();
            } else {
              const loadHandler = () => onLoad();
              imgElement.addEventListener('load', loadHandler, { once: true });
              
              if (imgElement.src) {
                setTimeout(() => {
                  if (imgElement.complete && imgElement.naturalHeight > 0) {
                    loadHandler();
                  }
                }, 50);
              }
            }
          }, 0);
        }}
      />
    </Box>
  );
};

const Signage = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [lastImageLoadTime, setLastImageLoadTime] = useState(0);

  const imageSource = process.env.REACT_APP_IMAGE_SOURCE || process.env.REACT_APP_ONEDRIVE_LINK;
  const slideDuration = parseInt(process.env.REACT_APP_SIGNAGE_SLIDE_DURATION || '10000', 10);
  const refreshInterval = parseInt(process.env.REACT_APP_SIGNAGE_REFRESH_INTERVAL || '86400000', 10);

  useEffect(() => {
    if (!imageSource) {
      setError('Image source not configured. Please set REACT_APP_IMAGE_SOURCE environment variable.');
      setLoading(false);
      return;
    }

    fetchImages(imageSource, false);

    const refreshTimer = setInterval(() => {
      fetchImages(imageSource, true);
    }, refreshInterval);

    return () => clearInterval(refreshTimer);
  }, [imageSource, refreshInterval]);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, slideDuration);

    return () => clearInterval(interval);
  }, [images.length, slideDuration]);

  const fetchImages = async (source, isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
        setError(null);
      }

      if (source.endsWith('.json') || (source.includes('/api/') && source.includes('.json'))) {
        const response = await fetch(source);
        if (!response.ok) {
          throw new Error(`Failed to fetch JSON file: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const imageUrls = Array.isArray(data) 
          ? data.filter(url => url && typeof url === 'string')
          : (data.images || []).filter(url => url && typeof url === 'string');
        
        if (imageUrls.length === 0) {
          if (!isRefresh) {
            setError('No images found in JSON file. Please ensure the file contains an array of image URLs.');
            setLoading(false);
          }
          return;
        }

        setLoadedImages(new Set());
        
        setImages(imageUrls);
        setCurrentIndex(0);
        setLoading(false);
        return;
      }

      if (source.includes('googledrive') || source.includes('folderId')) {
        const response = await fetch(source);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || errorData.error || `Failed to fetch from Google Drive: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const imageUrls = Array.isArray(data.images) 
          ? data.images.filter(url => url && typeof url === 'string')
          : [];
        
        if (imageUrls.length === 0) {
          if (!isRefresh) {
            setError('No images found in Google Drive folder. Please ensure the folder is shared publicly and contains images.');
            setLoading(false);
          }
          return;
        }
        
        setLoadedImages(new Set());
        
        setImages(imageUrls);
        setCurrentIndex(0);
        if (!isRefresh) {
          setLoading(false);
        }
        return;
      }

      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Failed to fetch from source: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const imageUrls = Array.isArray(data) 
        ? data.filter(url => url && typeof url === 'string')
        : (data.images || []).filter(url => url && typeof url === 'string');
      
      if (imageUrls.length === 0) {
        if (!isRefresh) {
          setError('No images found. Please ensure the source provides an array of image URLs or use a JSON file.');
          setLoading(false);
        }
        return;
      }

      setLoadedImages(new Set());
      
      setImages(imageUrls);
      setCurrentIndex(0);
      if (!isRefresh) {
        setLoading(false);
      }
    } catch (err) {
      const errorMessage = err.message || 'Unknown error occurred';
      
      if (!isRefresh) {
        setError(`Failed to load images: ${errorMessage}`);
        setLoading(false);
      }
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
            Please configure REACT_APP_IMAGE_SOURCE with a JSON file URL or Google Drive proxy URL.
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
      {images.map((imageUrl, index) => {
        const isActive = index === currentIndex;
        const isLoaded = loadedImages.has(imageUrl);
        
        return (
          <Box
            key={index}
            className={`signage-slide ${isActive ? 'active' : ''}`}
            style={{ 
              display: isActive ? 'flex' : 'none',
              opacity: isActive ? 1 : 0,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isActive ? (
              <ActiveImageWithThrottle
                imageUrl={imageUrl}
                index={index}
                currentIndex={currentIndex}
                lastImageLoadTime={lastImageLoadTime}
                setLastImageLoadTime={setLastImageLoadTime}
                onLoad={() => {
                  setLoadedImages(prev => new Set([...prev, imageUrl]));
                }}
              />
            ) : null}
          </Box>
        );
      })}
    </Box>
  );
};

export default Signage;
