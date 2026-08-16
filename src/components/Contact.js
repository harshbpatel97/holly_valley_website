import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  HStack,
  VStack,
  Flex,
  Badge,
  Button,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
  Link as ChakraLink,
} from '@chakra-ui/react';
import StoreStatusBadge from './StoreStatusBadge';
import { AppleMapsIcon, GoogleMapsIcon } from './MapIcons';
import { track } from '../utils/ga';
import './Contact.css';

const phoneNumber = '(336) 304-0094';
const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Holly+Valley,2730+NC+Hwy+18+S,Moravian+Falls,NC+28654';
const appleMapsUrl = 'https://maps.apple.com/?q=Holly+Valley,2730+NC+Hwy+18+S,Moravian+Falls,NC+28654';

const faqs = [
  {
    q: 'Do you accept EBT / SNAP benefits?',
    a: 'Yes! Holly Valley proudly accepts all valid EBT / SNAP electronic benefit transfer cards for eligible food and grocery items.',
  },
  {
    q: 'How do I reserve a U-Haul moving truck or trailer?',
    a: 'You can reserve online 24/7 through our official U-Haul dealer page, or call our store directly during business hours at (336) 304-0094.',
  },
  {
    q: 'What are the age requirements for lottery, alcohol, and tobacco?',
    a: 'You must be at least 18 years old with a valid government-issued photo ID to purchase NC Lottery tickets. You must be at least 21 years old to purchase tobacco, vape, or alcohol products.',
  },
  {
    q: 'What forms of payment do you take?',
    a: 'We accept Cash, EBT / SNAP, Visa, MasterCard, Discover, American Express, Apple Pay, Google Pay, Contactless Tap, and Debit Cards.',
  },
  {
    q: 'Do you have an on-site ATM?',
    a: 'Yes, we have a safe, secure, low-fee cash ATM terminal and Bitcoin kiosk accessible during all store operating hours.',
  },
];

const Contact = () => {
  const toast = useToast();

  const cardBg = useColorModeValue('white', '#131C2E');
  const cardBorder = useColorModeValue('gray.200', '#27354F');
  const subtleBg = useColorModeValue('gray.50', '#0E1626');
  const headingColor = useColorModeValue('gray.900', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const heroGradient = useColorModeValue('linear(to-b, brand.50, transparent)', 'linear(to-b, rgba(13, 148, 136, 0.1), transparent)');

  const onCallClick = () => {
    track('phone_click', { location: 'contact_page' });
  };

  const onDirectionsClick = (provider) => {
    track('directions_click', { provider, location: 'contact_page' });
  };

  const copyAddress = () => {
    navigator.clipboard.writeText('2730 NC Hwy 18 S, Moravian Falls, NC 28654');
    toast({
      title: 'Address copied!',
      description: '2730 NC Hwy 18 S, Moravian Falls, NC 28654 copied to clipboard.',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'bottom',
    });
    track('copy_address_click', { location: 'contact_page' });
  };

  return (
    <Box className="contact-page" pb={16}>
      {/* 1. Header */}
      <Box
        pt={{ base: 8, md: 12 }}
        pb={{ base: 8, md: 10 }}
        bgGradient={heroGradient}
      >
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} textAlign="center">
          <Badge colorScheme="teal" px={3} py={1} borderRadius="full" mb={3}>
            GET IN TOUCH & VISIT US
          </Badge>
          <Heading as="h1" fontSize={{ base: '2.5rem', md: '3.2rem' }} fontWeight="800" color={headingColor} mb={4}>
            Contact & Store Location
          </Heading>
          <Text color={textColor} fontSize={{ base: 'md', md: 'lg' }} maxW="2xl" mx="auto">
            Have questions about inventory, U-Haul equipment availability, or lottery services? We're here to assist you 7 days a week.
          </Text>
        </Container>
      </Box>

      {/* 2. Split Screen: Contact Details + Interactive Map */}
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} mb={12}>
        <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={8} alignItems="stretch">
          {/* Left Column: Direct Info & CTAs */}
          <Box
            gridColumn={{ lg: 'span 5' }}
            p={6}
            bg={cardBg}
            borderRadius="2xl"
            border="1px solid"
            borderColor={cardBorder}
            boxShadow="md"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <VStack align="stretch" spacing={6}>
              <Box>
                <HStack justify="space-between" align="center" mb={2}>
                  <Heading as="h2" fontSize="xl" fontWeight="800" color={headingColor}>
                    Store Details
                  </Heading>
                  <StoreStatusBadge showFullText={false} size="sm" />
                </HStack>
                <Text fontSize="xs" color={textColor}>
                  2730 NC Hwy 18 S, Moravian Falls, NC 28654
                </Text>
              </Box>

              {/* Call Box */}
              <Box p={4} borderRadius="xl" bg={subtleBg} border="1px solid" borderColor={cardBorder}>
                <Text fontSize="xs" fontWeight="700" color={textColor} textTransform="uppercase" mb={1}>
                  Direct Phone Line:
                </Text>
                <ChakraLink
                  href={`tel:${phoneNumber.replace(/[^0-9]/g, '')}`}
                  fontSize="xl"
                  fontWeight="800"
                  color="brand.500"
                  onClick={onCallClick}
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                >
                  <span>📞</span> {phoneNumber}
                </ChakraLink>
                <Text fontSize="xs" color={textColor} mt={1}>
                  Call for store inquiries or U-Haul truck availability.
                </Text>
              </Box>

              {/* Hours Box */}
              <Box p={4} borderRadius="xl" bg={subtleBg} border="1px solid" borderColor={cardBorder}>
                <Text fontSize="xs" fontWeight="700" color={textColor} textTransform="uppercase" mb={2}>
                  Store Hours:
                </Text>
                <VStack align="stretch" spacing={1.5} fontSize="xs" color={textColor}>
                  <Flex justify="space-between">
                    <Text fontWeight="600" color={headingColor}>Monday – Saturday:</Text>
                    <Text>8:00 AM – 8:00 PM</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text fontWeight="600" color={headingColor}>Sunday:</Text>
                    <Text>11:00 AM – 7:30 PM</Text>
                  </Flex>
                </VStack>
              </Box>

              {/* Action Buttons */}
              <VStack spacing={3}>
                <Button
                  as="a"
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  w="100%"
                  colorScheme="brand"
                  bg="brand.500"
                  color="white"
                  _hover={{ bg: 'brand.600' }}
                  py={6}
                  leftIcon={<GoogleMapsIcon />}
                  onClick={() => onDirectionsClick('google_maps')}
                >
                  Get Driving Directions
                </Button>

                <HStack w="100%" spacing={3}>
                  <Button
                    as="a"
                    href={appleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    flex="1"
                    variant="outline"
                    size="sm"
                    leftIcon={<AppleMapsIcon />}
                    onClick={() => onDirectionsClick('apple_maps')}
                  >
                    Apple Maps
                  </Button>
                  <Button
                    flex="1"
                    variant="outline"
                    size="sm"
                    onClick={copyAddress}
                    leftIcon={<Box as="span">📋</Box>}
                  >
                    Copy Address
                  </Button>
                </HStack>
              </VStack>
            </VStack>
          </Box>

          {/* Right Column: Full Interactive Map */}
          <Box
            gridColumn={{ lg: 'span 7' }}
            p={4}
            bg={cardBg}
            borderRadius="2xl"
            border="1px solid"
            borderColor={cardBorder}
            boxShadow="md"
            h={{ base: '320px', md: '450px' }}
          >
            <Box borderRadius="xl" overflow="hidden" w="100%" h="100%">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d51576.80827655196!2d-81.22339562721537!3d36.10444355488105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x885113264059d395%3A0xa1eb466dc155b46d!2sHolly%20Valley!5e0!3m2!1sen!2sus!4v1639761501521!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Holly Valley Location Map"
              />
            </Box>
          </Box>
        </SimpleGrid>
      </Container>

      {/* 3. Frequently Asked Questions (FAQ) */}
      <Container maxW="4xl" px={{ base: 4, sm: 6, lg: 8 }}>
        <VStack spacing={3} textAlign="center" mb={8}>
          <Badge colorScheme="teal" px={3} py={1} borderRadius="full">
            COMMUNITY HELP & FAQS
          </Badge>
          <Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" color={headingColor}>
            Frequently Asked Questions
          </Heading>
        </VStack>

        <Accordion allowMultiple defaultIndex={[0]}>
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              border="1px solid"
              borderColor={cardBorder}
              borderRadius="xl"
              bg={cardBg}
              mb={3}
              overflow="hidden"
            >
              <AccordionButton py={4} px={5} _hover={{ bg: subtleBg }}>
                <Box as="span" flex="1" textAlign="left" fontWeight="700" fontSize="sm" color={headingColor}>
                  {faq.q}
                </Box>
                <AccordionIcon color="brand.500" />
              </AccordionButton>
              <AccordionPanel pb={4} px={5} color={textColor} fontSize="sm" lineHeight="1.6">
                {faq.a}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Box>
  );
};

export default Contact;