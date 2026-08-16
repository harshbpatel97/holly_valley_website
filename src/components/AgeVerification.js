import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Divider,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import './AgeVerification.css';

const AgeVerification = ({ onVerify, onExit }) => {
  const cardBg = useColorModeValue('white', '#131C2E');
  const cardBorder = useColorModeValue('gray.200', '#27354F');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.900', 'white');
  const innerBoxBg = useColorModeValue('gray.50', '#0E1626');

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      bg="rgba(0, 0, 0, 0.75)"
      className="age-verification-overlay"
    >
      <Box
        maxW="540px"
        w="100%"
        bg={cardBg}
        borderRadius="3xl"
        border="1px solid"
        borderColor={cardBorder}
        boxShadow="2xl"
        p={{ base: 6, sm: 8 }}
        textAlign="center"
        position="relative"
        overflow="hidden"
      >
        {/* Top Accent Line */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="4px"
          bgGradient="linear(to-r, brand.500, teal.400, amber.500)"
        />

        <VStack spacing={5} align="stretch">
          <Box>
            <HStack justify="center" spacing={2} mb={3}>
              <Badge colorScheme="red" px={2.5} py={0.5} borderRadius="full" fontSize="xs">
                21+ RESTRICTED
              </Badge>
              <Badge colorScheme="blue" px={2.5} py={0.5} borderRadius="full" fontSize="xs">
                18+ LOTTERY
              </Badge>
            </HStack>

            <Heading as="h2" fontSize={{ base: 'xl', sm: '2xl' }} fontWeight="800" color={headingColor} mb={2}>
              Age Verification Required
            </Heading>

            <Text fontSize="xs" color={textColor} lineHeight="1.6">
              This website contains information regarding regulated items including tobacco, alcohol, and North Carolina lottery services.
            </Text>
          </Box>

          <Box
            p={4}
            borderRadius="2xl"
            bg={innerBoxBg}
            border="1px solid"
            borderColor={cardBorder}
            textAlign="left"
          >
            <Text fontSize="xs" fontWeight="700" color={headingColor} mb={2}>
              By entering this website, I certify that:
            </Text>
            <List spacing={1.5} fontSize="xs" color={textColor}>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="brand.500" />
                I am at least 21 years of age for tobacco and alcohol products
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="brand.500" />
                I am at least 18 years of age for NC Lottery services
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="brand.500" />
                I will comply with all federal, state, and local laws
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="brand.500" />
                I understand this site provides store information only
              </ListItem>
            </List>
          </Box>

          {/* Action Buttons */}
          <VStack spacing={2.5} pt={1}>
            <Button
              w="100%"
              size="lg"
              colorScheme="brand"
              bg="brand.500"
              color="white"
              _hover={{ bg: 'brand.600', transform: 'translateY(-1px)' }}
              py={6}
              borderRadius="xl"
              fontWeight="700"
              onClick={onVerify}
              boxShadow="md"
            >
              I AM 21+ • ENTER SITE
            </Button>

            <Button
              w="100%"
              size="md"
              variant="ghost"
              colorScheme="gray"
              borderRadius="xl"
              onClick={onExit}
              fontSize="sm"
            >
              Exit / I am under 21
            </Button>
          </VStack>

          <Divider borderColor={cardBorder} />

          <Text fontSize="10px" color="gray.500" lineHeight="1.4">
            Holly Valley strictly complies with all North Carolina regulations. Always enjoy responsibly. If you or someone you know has a gambling problem, call 1-800-522-4700.
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default AgeVerification;