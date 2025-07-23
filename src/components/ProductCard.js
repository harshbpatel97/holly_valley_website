import React from 'react';
import { Box, Image, Text, Badge, Stack, useColorModeValue } from '@chakra-ui/react';

const ProductCard = ({ image, name, description, category, onClick }) => {
  // Always call hooks at the top level
  const bg = useColorModeValue('white', 'gray.800');
  const hoverBoxShadow = 'xl';
  const hoverTransform = 'scale(1.03)';
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box
      maxW="200px"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      bg={bg}
      _hover={{ boxShadow: hoverBoxShadow, transform: hoverTransform }}
      transition="all 0.2s"
      m={2}
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
    >
      <Image src={image} alt={name} objectFit="cover" w="100%" h="140px" />
      <Box p="3">
        <Stack direction="row" align="center" mb={2}>
          {category && <Badge colorScheme="teal">{category}</Badge>}
        </Stack>
        <Text fontWeight="bold" fontSize="md" mb={1}>{name}</Text>
        {description && (
          <Text fontSize="sm" color={textColor}>
            {description}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default ProductCard; 