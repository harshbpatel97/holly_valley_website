import React, { useEffect } from 'react';
import { Box, VStack, Text, Heading } from '@chakra-ui/react';

const SignageAccessDenied = ({ tokenProvided = false }) => {
  const measurementId = process.env.REACT_APP_GA_ID;

  useEffect(() => {
    // Track access denied event with additional details
    // This component only tracks the page view, SignageRoute tracks the access attempt
    const trackAccessDenied = async () => {
      if (!measurementId || !window.gtag) return;

      // Get IP address
      let ipAddress = null;
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip;
      } catch (error) {
        // IP fetch failed, continue without IP
      }

      window.gtag('config', measurementId, {
        page_path: '/signage?token=...',
        page_title: 'Signage Access Denied',
      });
      
      window.gtag('event', 'signage_access_denied_view', {
        event_category: 'Security',
        event_label: 'access_denied_page_view',
        has_token: tokenProvided,
        token_valid: false,
        access_granted: false,
        reason: tokenProvided ? 'invalid_token' : 'no_token',
        ...(ipAddress && { ip_address: ipAddress }),
      });
    };

    trackAccessDenied();
  }, [measurementId, tokenProvided]);
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

