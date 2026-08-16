import React from 'react';
import { useColorMode, IconButton, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const DarkModeToggle = ({ size = 'md' }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const hoverBg = useColorModeValue('gray.200', 'whiteAlpha.200');
  const iconColor = useColorModeValue('gray.700', 'amber.400');

  return (
    <Tooltip label={colorMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'} hasArrow>
      <IconButton
        aria-label="Toggle dark mode"
        icon={colorMode === 'light' ? <MoonIcon color={iconColor} /> : <SunIcon color={iconColor} />}
        onClick={toggleColorMode}
        variant="ghost"
        size={size}
        borderRadius="xl"
        _hover={{ bg: hoverBg, transform: 'scale(1.08)' }}
        _active={{ transform: 'scale(0.95)' }}
        transition="all 0.2s ease"
      />
    </Tooltip>
  );
};

export default DarkModeToggle;