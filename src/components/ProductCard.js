import React from 'react';
import { Box, Text, Badge, useColorModeValue, Flex } from '@chakra-ui/react';
import ThrottledImage from './ThrottledImage';

const THROTTLE_DELAY_MS = 60;

const categoryColorSchemes = {
  groceries: 'green',
  softdrinks: 'blue',
  icebags: 'cyan',
  frozenpizza: 'red',
  firewood: 'orange',
  icecream: 'purple',
};

const ProductCard = ({ image, name, description, category, categoryId, onClick, index = 0 }) => {
  const bg = useColorModeValue('white', '#131C2E');
  const borderColor = useColorModeValue('gray.200', '#27354F');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const titleColor = useColorModeValue('gray.900', 'white');

  const delay = index * THROTTLE_DELAY_MS;
  const colorScheme = categoryColorSchemes[categoryId] || 'teal';

  return (
    <Box
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      boxShadow="sm"
      bg={bg}
      _hover={{
        boxShadow: 'xl',
        transform: 'translateY(-4px)',
        borderColor: 'brand.500',
      }}
      transition="all 0.25s ease"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      role="group"
      display="flex"
      flexDirection="column"
      h="100%"
    >
      <Box position="relative" overflow="hidden" bg={useColorModeValue('gray.100', '#0E1626')} h="180px">
        <ThrottledImage
          src={image}
          alt={name}
          objectFit="cover"
          w="100%"
          h="100%"
          delay={delay}
          maxRetries={3}
          retryDelay={3000}
        />
        {/* Subtle hover overlay hint */}
        <Flex
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.25)"
          opacity={0}
          _groupHover={{ opacity: 1 }}
          transition="opacity 0.2s"
          align="center"
          justify="center"
        >
          <Badge bg="whiteAlpha.900" color="gray.800" fontSize="xs" px={2.5} py={1} borderRadius="full" boxShadow="md">
            🔍 Click to Zoom
          </Badge>
        </Flex>
      </Box>

      <Box p={4} flex="1" display="flex" flexDirection="column" justifyContent="space-between">
        <Box>
          {category && (
            <Badge colorScheme={colorScheme} fontSize="10px" mb={2}>
              {category}
            </Badge>
          )}
          <Text fontWeight="700" fontSize="md" color={titleColor} mb={1} lineHeight="1.3">
            {name}
          </Text>
          {description && (
            <Text fontSize="xs" color={textColor} lineHeight="1.5">
              {description}
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductCard;