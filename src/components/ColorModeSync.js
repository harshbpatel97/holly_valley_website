import { useEffect, useRef } from 'react';
import { useColorMode } from '@chakra-ui/react';
import { useSearchParams, useLocation } from 'react-router-dom';

/**
 * Component that syncs URL parameters with color mode
 * Supports ?theme=dark, ?theme=light, ?mode=dark, ?mode=light
 * 
 * Usage:
 * - Add ?theme=dark or ?mode=dark to URL for dark mode
 * - Add ?theme=light or ?mode=light to URL for light mode
 * - Works across all pages on the website
 * - URL parameter takes precedence and updates localStorage
 */
const ColorModeSync = () => {
  const { setColorMode } = useColorMode();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const lastProcessedRef = useRef('');

  useEffect(() => {
    // Check for theme parameter in URL (supports both 'theme' and 'mode' params)
    const themeParam = searchParams.get('theme') || searchParams.get('mode');
    const currentSearch = searchParams.toString();
    const currentKey = `search:${currentSearch}`;
    
    // Skip if we already processed this exact URL state
    if (lastProcessedRef.current === currentKey) {
      return;
    }
    
    if (themeParam) {
      const normalizedTheme = themeParam.toLowerCase().trim();
      
      // Update if the parameter is valid (dark or light)
      if (normalizedTheme === 'dark' || normalizedTheme === 'light') {
        // Update Chakra UI color mode
        setColorMode(normalizedTheme);
        
        // Also update localStorage directly to ensure persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('chakra-ui-color-mode', normalizedTheme);
        }
        
        lastProcessedRef.current = currentKey;
      }
    } else {
      lastProcessedRef.current = currentKey;
    }
  }, [location.pathname, location.search, searchParams, setColorMode]);

  // This component doesn't render anything
  return null;
};

export default ColorModeSync;

