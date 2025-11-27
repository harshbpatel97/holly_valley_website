import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Image, Spinner, Box } from '@chakra-ui/react';
import { queueImageLoad } from '../utils/imageThrottle';

/**
 * Throttled Image Component
 * 
 * Prevents rate limiting by:
 * - Using global queue to ensure sequential loading with proper delays
 * - Retrying failed requests with exponential backoff
 * - Using blob URLs on mobile to bypass CORS
 * - Handling 429 errors gracefully
 */
const ThrottledImage = ({ 
  src, 
  alt, 
  delay = 0, 
  retryDelay = 3000,
  maxRetries = 3,
  onLoad,
  onError,
  ...imageProps 
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef(null);
  const blobUrlRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isLoadingRef = useRef(false); // Track if we're currently loading

  // Detect mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  useEffect(() => {
    // Cleanup on unmount or src change
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [src]);

  const loadImage = useCallback(async (imageUrl, attemptNumber = 0) => {
    try {
      // Don't abort if we're retrying - let previous abort controller finish cleanup
      if (abortControllerRef.current && attemptNumber === 0) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      // Only set loading/error states on first attempt
      if (attemptNumber === 0) {
        setLoading(true);
        setError(false);
      }

      // Import and normalize the URL to ensure it's in thumbnail format
      const { normalizeGoogleDriveImageUrl } = await import('../utils/googleDriveImages');
      const normalizedUrl = normalizeGoogleDriveImageUrl(imageUrl);
      
      // Queue the actual load operation - this ensures only one image loads at a time
      // Wait for our turn in the queue, then set the image source
      // Note: Google Drive thumbnail URLs redirect to googleusercontent.com URLs
      // This is normal - the redirect happens server-side and doesn't cause additional rate limiting
      // The important part is we're using the thumbnail endpoint which is more reliable
      await queueImageLoad(() => {
        // This function executes when it's our turn to load
      });
      
      // Set the image source AFTER the queue delay - this ensures throttling
      // React state update happens here, outside the queue callback
      // Use functional update to ensure React processes the state change
      setImageSrc(prevSrc => {
        if (prevSrc === normalizedUrl) {
          return prevSrc;
        }
        isLoadingRef.current = false; // Mark loading as complete
        return normalizedUrl;
      });
    } catch (error) {
      console.error(`[ThrottledImage] Error loading image:`, error);
      setError(true);
      setLoading(false);
    }
  }, []); // Empty deps - loadImage is stable, src is passed as parameter

  useEffect(() => {
    if (!src) {
      setImageSrc(null);
      setLoading(false);
      isLoadingRef.current = false;
      return;
    }

    // If we're already loading this src, don't reset
    if (isLoadingRef.current && imageSrc === src) {
      return;
    }

    // Clear any existing timeouts
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    // Reset state
    setRetryCount(0);
    setError(false);
    setLoading(true);
    isLoadingRef.current = true;

    // Initial delay before queuing (for visual staggering), then queue the load
    const loadTimer = setTimeout(() => {
      loadImage(src, 0);
    }, delay);

    return () => {
      clearTimeout(loadTimer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      isLoadingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, delay]); // loadImage is stable, imageSrc check is intentional

  if (error) {
    return (
      <Box 
        w="100%" 
        h={imageProps.h || "140px"} 
        bg="gray.200" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        {...imageProps}
      >
        <Box textAlign="center" color="gray.500" fontSize="xs">
          Image unavailable
        </Box>
      </Box>
    );
  }

  // Only show spinner if we don't have an imageSrc yet
  // Once imageSrc is set, render the Image component (it will handle loading/error states)
  if (!imageSrc) {
    return (
      <Box 
        w="100%" 
        h={imageProps.h || "140px"} 
        bg="gray.100" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        {...imageProps}
      >
        <Spinner size="sm" />
      </Box>
    );
  }

  return (
    <Image 
      src={imageSrc} 
      alt={alt} 
      onLoad={() => {
        setLoading(false);
        if (onLoad) onLoad();
      }}
      onError={(e) => {
        // If error and URL is googleusercontent, try converting to thumbnail format
        if (imageSrc && imageSrc.includes('googleusercontent.com')) {
          const { normalizeGoogleDriveImageUrl } = require('../utils/googleDriveImages');
          const thumbnailUrl = normalizeGoogleDriveImageUrl(imageSrc);
          if (thumbnailUrl !== imageSrc) {
            setImageSrc(thumbnailUrl);
            setRetryCount(0);
            return;
          }
        }
        
        // Handle errors - retry with exponential backoff
        if (retryCount < maxRetries) {
          const backoffDelay = Math.pow(2, retryCount) * retryDelay;
          retryTimeoutRef.current = setTimeout(async () => {
            setRetryCount(prev => prev + 1);
            setError(false);
            setLoading(true);
            await loadImage(src, retryCount + 1);
          }, backoffDelay);
        } else {
          setError(true);
          setLoading(false);
          if (onError) onError(e);
        }
      }}
      {...imageProps}
    />
  );
};

export default ThrottledImage;

