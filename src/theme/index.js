import { extendTheme } from '@chakra-ui/react';

// Check URL parameters for initial theme setting
export const getInitialColorMode = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get('theme') || urlParams.get('mode');
    if (themeParam) {
      const normalizedTheme = themeParam.toLowerCase().trim();
      if (normalizedTheme === 'dark' || normalizedTheme === 'light') {
        return normalizedTheme;
      }
    }
    
    // Check localStorage for saved preference
    const savedTheme = localStorage.getItem('chakra-ui-color-mode');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
  }
  return 'light';
};

const colors = {
  brand: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#0d9488', // Primary brand teal
    600: '#0f766e',
    700: '#115e59',
    800: '#134e4a',
    900: '#042f2e',
  },
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Warm amber / gold
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  darkBg: {
    base: '#0b0f17',
    card: '#131c2e',
    cardHover: '#1a273f',
    subtle: '#1e293b',
    border: '#27354f',
  },
  lightBg: {
    base: '#f8fafc',
    card: '#ffffff',
    cardHover: '#f1f5f9',
    subtle: '#f1f5f9',
    border: '#e2e8f0',
  }
};

const fonts = {
  heading: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
  body: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
};

const styles = {
  global: (props) => ({
    body: {
      bg: props.colorMode === 'dark' ? colors.darkBg.base : colors.lightBg.base,
      color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
      transitionProperty: 'background-color, color',
      transitionDuration: '0.2s',
    },
  }),
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: '600',
      borderRadius: 'xl',
      transition: 'all 0.2s ease-in-out',
    },
    variants: {
      solid: (props) => ({
        bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
        color: 'white',
        _hover: {
          bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
          transform: 'translateY(-1px)',
          boxShadow: 'md',
        },
        _active: {
          transform: 'translateY(0)',
        },
      }),
      outline: (props) => ({
        borderColor: props.colorScheme === 'brand' ? 'brand.500' : undefined,
        color: props.colorScheme === 'brand' ? (props.colorMode === 'dark' ? 'brand.300' : 'brand.600') : undefined,
        _hover: {
          bg: props.colorScheme === 'brand' ? (props.colorMode === 'dark' ? 'rgba(13, 148, 136, 0.15)' : 'brand.50') : undefined,
          transform: 'translateY(-1px)',
        },
      }),
    },
  },
  Badge: {
    baseStyle: {
      borderRadius: 'full',
      px: 3,
      py: 0.5,
      fontWeight: '600',
      letterSpacing: '0.025em',
      textTransform: 'uppercase',
    },
  },
};

const theme = extendTheme({
  config: {
    initialColorMode: getInitialColorMode(),
    useSystemColorMode: false,
  },
  colors,
  fonts,
  styles,
  components,
});

export default theme;
