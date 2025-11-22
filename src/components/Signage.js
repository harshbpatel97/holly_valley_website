import React, { useState, useEffect, useRef } from 'react';
import { Box, Spinner, Text, VStack, HStack } from '@chakra-ui/react';
import './Signage.css';

const ActiveImageWithThrottle = ({ imageUrl, index, currentIndex, lastImageLoadTime, setLastImageLoadTime, onLoad }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [imageError, setImageError] = useState(false);
  const retryTimeoutRef = useRef(null);
  const loadTimeoutRef = useRef(null);
  const prevImageUrlRef = useRef(null);
  const prevCurrentIndexRef = useRef(null);
  
  // Detect mobile device for optimized loading
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
      setRetryCount(0);
      setShouldLoad(false);
      setImageError(false);
    }

    // Use shorter delay on mobile (1 second) vs desktop (2 seconds)
    // This helps prevent timeouts on slower mobile networks
    const timeSinceLastLoad = lastImageLoadTime > 0 ? Date.now() - lastImageLoadTime : 999999;
    const minDelay = isMobile ? 1000 : 2000;
    const delay = lastImageLoadTime > 0 ? Math.max(0, minDelay - timeSinceLastLoad) : 0;

    const loadTimer = setTimeout(() => {
      setShouldLoad(true);
      setLastImageLoadTime(Date.now());
    }, delay);

    return () => clearTimeout(loadTimer);
  }, [currentIndex, imageUrl, lastImageLoadTime, setLastImageLoadTime, shouldLoad, index, isMobile]);

  const handleError = (e) => {
    setImageError(true);
    
    // Track 403 errors from Google Drive URLs (especially expired CDN URLs)
    const img = e.target;
    if (img && img.src && (img.src.includes('googleusercontent.com') || img.src.includes('drive.google.com'))) {
      errorCountRef.current += 1;
      
      // If multiple errors detected (likely expired URLs), trigger JSON refresh
      if (errorCountRef.current >= 3 && imageSource) {
        setTimeout(() => {
          // Refresh images JSON to get new URLs (in case they were regenerated)
          fetchImages(imageSource, true);
          errorCountRef.current = 0; // Reset error count
        }, 10000); // Wait 10 seconds before refreshing
      }
    }
    
    if (retryCount < 3) {
      // Faster retries on mobile
      const retryDelay = isMobile 
        ? Math.pow(2, retryCount) * 2000 
        : Math.pow(2, retryCount + 1) * 5000;
      retryTimeoutRef.current = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setImageError(false);
        setShouldLoad(true);
        setLastImageLoadTime(Date.now());
      }, retryDelay);
    }
  };

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
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

  if (imageError && retryCount >= 1) {
    const isGoogleDrive = imageUrl && imageUrl.includes('drive.google.com');
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
        <Box textAlign="center" maxW="600px">
          <Text fontSize="lg" color="red.400" mb={2} fontWeight="bold">
            Unable to load image {index + 1}
          </Text>
          {isGoogleDrive ? (
            <>
              <Text fontSize="md" color="gray.300" mb={3}>
                Error 403: Access Denied
              </Text>
              <Text fontSize="sm" color="gray.400" mb={2}>
                Google Drive images must be publicly shared:
              </Text>
              <VStack spacing={1} align="flex-start" fontSize="xs" color="gray.500" textAlign="left" mt={2}>
                <Text>1. Open your Google Drive folder</Text>
                <Text>2. Right-click → Share → "Anyone with the link" → Viewer</Text>
                <Text>3. Also share each image file individually</Text>
                <Text>4. Regenerate images: npm run generate-signage-images-gdrive</Text>
              </VStack>
            </>
          ) : (
            <Text fontSize="sm" color="gray.500">
              Check your connection or image URL
            </Text>
          )}
        </Box>
      </Box>
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
        key={`image-${index}-${retryCount}`}
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
          margin: 'auto',
          opacity: imageError ? 0.5 : 1,
          transition: 'opacity 0.3s ease'
        }}
        onError={(e) => {
          // Try alternative URL format for Google Drive if original fails
          if (imageUrl && imageUrl.includes('drive.google.com')) {
            if (imageUrl.includes('export=view') && retryCount === 0) {
              // Try export=download format as fallback
              const altUrl = imageUrl.replace('export=view', 'export=download');
              e.target.src = altUrl;
              setRetryCount(1);
              setImageError(false);
              return;
            }
            // If CDN URL failed, try export=view format
            if (imageUrl.includes('googleusercontent.com') && retryCount === 0) {
              // Extract file ID from URL if possible, or use alternative approach
              const fileIdMatch = imageUrl.match(/[/=](\w{28,})/);
              if (fileIdMatch) {
                const altUrl = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
                e.target.src = altUrl;
                setRetryCount(1);
                setImageError(false);
                return;
              }
            }
          }
          handleError(e);
        }}
        onLoad={(e) => {
          setRetryCount(0);
          setImageError(false);
          onLoad();
        }}
        ref={(imgElement) => {
          if (!imgElement) return;
          
          setTimeout(() => {
            if (imgElement.complete && imgElement.naturalHeight > 0) {
              setImageError(false);
              onLoad();
            } else {
              const loadHandler = () => {
                if (loadTimeoutRef.current) {
                  clearTimeout(loadTimeoutRef.current);
                  loadTimeoutRef.current = null;
                }
                setImageError(false);
                onLoad();
              };
              imgElement.addEventListener('load', loadHandler, { once: true });
              
              // Timeout for mobile - if image doesn't load within 10 seconds, show error
              loadTimeoutRef.current = setTimeout(() => {
                if (!imgElement.complete || imgElement.naturalHeight === 0) {
                  handleError({ target: imgElement });
                }
              }, isMobile ? 10000 : 15000);
              
              if (imgElement.src) {
                setTimeout(() => {
                  if (imgElement.complete && imgElement.naturalHeight > 0) {
                    if (loadTimeoutRef.current) {
                      clearTimeout(loadTimeoutRef.current);
                      loadTimeoutRef.current = null;
                    }
                    loadHandler();
                  }
                }, 100);
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
  const [lastImageLoadTime, setLastImageLoadTime] = useState(0);
  const errorCountRef = useRef(0);

  const imageSource = process.env.REACT_APP_SIGNAGE_IMG_REF_LINK;
  const slideDuration = parseInt(process.env.REACT_APP_SIGNAGE_SLIDE_DURATION_MS || '10000', 10);
  // Convert days to milliseconds: 1 day = 24 * 60 * 60 * 1000 = 86400000 ms
  const refreshIntervalDays = parseInt(process.env.REACT_APP_SIGNAGE_REFRESH_INTERVAL_DAYS || '1', 10);
  const refreshInterval = refreshIntervalDays * 24 * 60 * 60 * 1000;

  useEffect(() => {
    if (!imageSource) {
      setError('Image source not configured. Please set REACT_APP_SIGNAGE_IMG_REF_LINK environment variable.');
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
    // Disable scrolling on body when signage is active
    document.body.classList.add('signage-active');
    
    return () => {
      // Re-enable scrolling when component unmounts
      document.body.classList.remove('signage-active');
    };
  }, []);

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
            Please configure REACT_APP_SIGNAGE_IMG_REF_LINK with a JSON file URL or Google Drive proxy URL.
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
      {/* Header with Logo */}
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        zIndex="100"
        bg="rgba(0, 0, 0, 0.8)"
        py={3}
        px={8}
      >
        <VStack spacing={2} align="center">
          {/* Logo and Brand Name */}
          <HStack spacing={6} align="center">
            <Box>
              <img
                src="/images/misc/holly_valley_logo.png"
                alt="Holly Valley Logo"
                style={{
                  height: '80px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </Box>
            <Text
              fontSize="4xl"
              fontWeight="900"
              color="white"
              letterSpacing="0.1em"
            >
              HOLLY VALLEY
            </Text>
          </HStack>
        </VStack>
      </Box>

      {/* Slideshow Images */}
      <Box position="relative" width="100%" height="calc(100vh - 25vh - 120px)" mt="120px" mb="25vh">
        {images.map((imageUrl, index) => {
          const isActive = index === currentIndex;
          
          return (
            <Box
              key={index}
              className={`signage-slide ${isActive ? 'active' : ''}`}
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isActive && (
                <ActiveImageWithThrottle
                  imageUrl={imageUrl}
                  index={index}
                  currentIndex={currentIndex}
                  lastImageLoadTime={lastImageLoadTime}
                  setLastImageLoadTime={setLastImageLoadTime}
                  onLoad={() => {}}
                />
              )}
            </Box>
          );
        })}
      </Box>

      {/* Footer with Legal Disclaimers - 25% of page height */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        width="100%"
        height="25vh"
        maxHeight="300px"
        zIndex="100"
        bg="rgba(0, 0, 0, 0.9)"
        py={2}
        px={8}
        overflowY="auto"
      >
        <VStack spacing={1.5} align="center" h="100%" justify="center">
          {/* Contact Info */}
          <HStack spacing={4} align="center">
            <Text fontSize="sm" color="white">
              Contact: <a href="tel:13363040094" style={{ color: '#4FD1C7' }}>+1(336)304-0094</a>
            </Text>
            <Text fontSize="sm" color="gray.400">|</Text>
            <Text fontSize="sm" color="white">DBA Holly Valley</Text>
          </HStack>

          {/* Legal Disclaimers - Compact */}
          <VStack spacing={1} align="center" maxW="1200px">
            {/* Age Restrictions */}
            <Text fontSize="sm" color="yellow.400" fontWeight="600" textAlign="center">
              Age Restricted Products: Tobacco/Alcohol 21+ | Lottery 18+ | Valid ID Required
            </Text>

            {/* NC Regulations & ABC Laws Compliance - Compact */}
            <Text fontSize="10px" color="gray.300" textAlign="center" lineHeight="1.4">
              <strong>LEGAL NOTICE - NC REGULATIONS & ABC LAWS COMPLIANCE:</strong> This establishment complies with all NC state regulations and ABC laws regarding tobacco products and alcoholic beverages (including cold beer). All advertisements are for informational purposes only. <strong>Tobacco:</strong> 21+ only, valid ID required. <strong>Alcoholic Beverages (Cold Beer):</strong> Regulated by NC ABC Commission, 21+ only, valid ID required. <strong>NC Lottery:</strong> 18+ only, valid ID required. Play responsibly. Gambling problem? Call 1-800-522-4700.
            </Text>
            <Text fontSize="10px" color="gray.400" textAlign="center" mt={1}>
              Holly Valley maintains strict compliance with all applicable regulations. 
              For more information, visit <a href="https://www.abc.nc.gov" target="_blank" rel="noopener noreferrer" style={{ color: '#4FD1C7' }}>abc.nc.gov</a> and <a href="https://www.nclottery.com" target="_blank" rel="noopener noreferrer" style={{ color: '#4FD1C7' }}>nclottery.com</a>
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default Signage;
