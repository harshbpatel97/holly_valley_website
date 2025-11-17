import React from 'react';
import { Box, VStack, Text, Heading } from '@chakra-ui/react';

const SignageAccessDenied = () => {
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
      <VStack spacing={6} align="center" maxW="600px" textAlign="center">
        <Heading fontSize="3xl" color="red.400">
          Access Denied
        </Heading>
        <Text fontSize="lg" color="gray.300">
          You do not have permission to access this page.
        </Text>
        <Text fontSize="md" color="gray.400">
          This page requires a valid access token. Please contact the administrator if you believe you should have access.
        </Text>
        <Text fontSize="sm" color="gray.500" mt={4}>
          If you have the access token, use the URL format:
          <br />
          <code style={{ color: '#4FD1C7', fontFamily: 'monospace', marginTop: '8px', display: 'block' }}>
            /signage?token=YOUR_TOKEN
          </code>
        </Text>
      </VStack>
    </Box>
  );
};

export default SignageAccessDenied;

