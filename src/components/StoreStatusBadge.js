import React, { useState, useEffect } from 'react';
import { HStack, Box, Text, useColorModeValue } from '@chakra-ui/react';
import { getStoreStatus } from '../utils/storeHours';

const StoreStatusBadge = ({ showFullText = false, size = 'sm' }) => {
  const [status, setStatus] = useState(getStoreStatus());

  useEffect(() => {
    // Update status every 60 seconds
    const interval = setInterval(() => {
      setStatus(getStoreStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const badgeBg = useColorModeValue(
    status.isOpen ? 'emerald.50' : 'red.50',
    status.isOpen ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'
  );
  const badgeBorder = useColorModeValue(
    status.isOpen ? 'teal.200' : 'red.200',
    status.isOpen ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'
  );
  const textColor = useColorModeValue(
    status.isOpen ? 'teal.800' : 'red.800',
    status.isOpen ? 'emerald.200' : 'red.200'
  );
  const dotBg = status.isOpen ? '#10B981' : '#EF4444';

  return (
    <HStack
      spacing={2}
      bg={badgeBg}
      border="1px solid"
      borderColor={badgeBorder}
      px={size === 'lg' ? 4 : 3}
      py={size === 'lg' ? 1.5 : 1}
      borderRadius="full"
      display="inline-flex"
      alignItems="center"
      transition="all 0.2s"
    >
      <Box position="relative" display="inline-flex" alignItems="center" justifyContent="center">
        <Box
          w={size === 'lg' ? '10px' : '8px'}
          h={size === 'lg' ? '10px' : '8px'}
          borderRadius="full"
          bg={dotBg}
        />
        {status.isOpen && (
          <Box
            position="absolute"
            w={size === 'lg' ? '18px' : '14px'}
            h={size === 'lg' ? '18px' : '14px'}
            borderRadius="full"
            bg={dotBg}
            opacity={0.4}
            animation="pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
          />
        )}
      </Box>
      <Text
        fontSize={size === 'lg' ? 'sm' : 'xs'}
        fontWeight="600"
        color={textColor}
        lineHeight="1"
        letterSpacing="0.01em"
      >
        {showFullText ? status.statusText : status.badgeText}
      </Text>
    </HStack>
  );
};

export default StoreStatusBadge;
