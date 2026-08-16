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
  Image,
  Link as ChakraLink,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { getImagePath } from '../utils/imageUtils';
import { useStoreImages } from '../config/storeImages';
import { track } from '../utils/ga';
import './Services.css';

const paymentBadges = [
  { name: 'Cash', icon: '💵' },
  { name: 'EBT / SNAP', icon: '💳' },
  { name: 'Visa', icon: '💳' },
  { name: 'MasterCard', icon: '💳' },
  { name: 'Discover', icon: '💳' },
  { name: 'American Express', icon: '💳' },
  { name: 'Apple Pay / NFC', icon: '📱' },
  { name: 'Google Pay', icon: '📱' },
  { name: 'Debit Cards', icon: '💳' },
  { name: 'Gift Cards', icon: '🎁' },
];

const Services = () => {
  const { storeImages } = useStoreImages();

  const cardBg = useColorModeValue('white', '#131C2E');
  const cardBorder = useColorModeValue('gray.200', '#27354F');
  const subtleBg = useColorModeValue('gray.50', '#0E1626');
  const headingColor = useColorModeValue('gray.900', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const heroGradient = useColorModeValue('linear(to-b, brand.50, transparent)', 'linear(to-b, rgba(13, 148, 136, 0.1), transparent)');
  const legalBg = useColorModeValue('amber.50', 'rgba(245, 158, 11, 0.1)');
  const legalBorder = useColorModeValue('amber.200', 'rgba(245, 158, 11, 0.3)');
  const legalTextColor = useColorModeValue('amber.900', 'amber.200');
  const gamblingBg = useColorModeValue('blue.50', 'rgba(59, 130, 246, 0.1)');
  const gamblingBorder = useColorModeValue('blue.200', 'rgba(59, 130, 246, 0.3)');
  const gamblingTitleColor = useColorModeValue('blue.900', 'blue.200');
  const gamblingSubColor = useColorModeValue('blue.800', 'blue.300');

  // Find U-Haul image from store images
  const uhaulImage = storeImages.find(
    (img) =>
      img.id?.toLowerCase().includes('uhaul') ||
      img.alt?.toLowerCase().includes('uhaul') ||
      img.title?.toLowerCase().includes('uhaul') ||
      img.src?.includes('11GxoHDvvscl-vN9FeQ7Byx9mUBgX3OfC')
  );

  const handleUhaulClick = () => {
    track('uhaul_booking_click', {
      destination: 'https://www.uhaul.com/Locations/Truck-Rentals-near-Moravian-Falls-NC-28654/017013/',
      location: 'services_page',
    });
  };

  return (
    <Box className="services-page" pb={16}>
      {/* 1. Header & Legal Notice */}
      <Box
        pt={{ base: 8, md: 12 }}
        pb={{ base: 8, md: 10 }}
        bgGradient={heroGradient}
      >
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} textAlign="center">
          <Badge colorScheme="teal" px={3} py={1} borderRadius="full" mb={3}>
            SERVICES & DEALERSHIPS
          </Badge>
          <Heading as="h1" fontSize={{ base: '2.5rem', md: '3.2rem' }} fontWeight="800" color={headingColor} mb={4}>
            Essential Community Services
          </Heading>
          <Text color={textColor} fontSize={{ base: 'md', md: 'lg' }} maxW="3xl" mx="auto">
            More than just a grocery store — Holly Valley provides official U-Haul rentals, authorized NC Lottery games, secure ATM services, and flexible payment options for Moravian Falls.
          </Text>

          {/* Legal Compliance Banner */}
          <Box
            mt={6}
            p={3.5}
            borderRadius="xl"
            bg={legalBg}
            border="1px solid"
            borderColor={legalBorder}
            maxW="3xl"
            mx="auto"
          >
            <Text fontSize="xs" color={legalTextColor} fontWeight="500">
              ⚖️ <strong>LEGAL NOTICE:</strong> Lottery services require valid government-issued photo ID (18+ only). Tobacco & alcohol products are for adults 21+ only. Please play responsibly.
            </Text>
          </Box>
        </Container>
      </Box>

      {/* 2. Main Service Deep-Dives */}
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
        <VStack spacing={10} align="stretch">
          {/* Service 1: U-Haul Neighborhood Dealer */}
          <Box
            p={{ base: 6, md: 8 }}
            bg={cardBg}
            borderRadius="2xl"
            border="1px solid"
            borderColor={cardBorder}
            boxShadow="md"
          >
            <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={8} alignItems="center">
              <Box gridColumn={{ lg: 'span 7' }}>
                <HStack spacing={2} mb={3}>
                  <Badge colorScheme="orange" px={3} py={1} borderRadius="full" fontSize="xs">
                    OFFICIAL NEIGHBORHOOD DEALER
                  </Badge>
                  <Badge colorScheme="green" fontSize="xs">In Stock</Badge>
                </HStack>

                <Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" color={headingColor} mb={3}>
                  🚚 U-Haul Truck & Trailer Rentals
                </Heading>

                <Text color={textColor} fontSize="sm" lineHeight="1.7" mb={4}>
                  Holly Valley is a certified <strong>U-Haul Neighborhood Dealer</strong> in Moravian Falls, NC. Whether you are moving across town or across the country, we offer moving trucks, cargo trailers, utility trailers, towing dollies, and packing supplies with convenient local pickup and drop-off.
                </Text>

                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3} mb={6}>
                  <Box p={3.5} borderRadius="xl" bg={subtleBg} border="1px solid" borderColor={cardBorder}>
                    <Text fontWeight="700" fontSize="sm" color={headingColor} mb={1.5}>
                      Equipment Available:
                    </Text>
                    <List spacing={1} fontSize="xs" color={textColor}>
                      <ListItem><ListIcon as={CheckCircleIcon} color="brand.500" /> Moving Trucks (10', 15', 20', 26')</ListItem>
                      <ListItem><ListIcon as={CheckCircleIcon} color="brand.500" /> Cargo & Utility Trailers</ListItem>
                      <ListItem><ListIcon as={CheckCircleIcon} color="brand.500" /> Tow Dollies & Auto Transports</ListItem>
                      <ListItem><ListIcon as={CheckCircleIcon} color="brand.500" /> Moving Boxes & Furniture Pads</ListItem>
                    </List>
                  </Box>

                  <Box p={3.5} borderRadius="xl" bg={subtleBg} border="1px solid" borderColor={cardBorder}>
                    <Text fontWeight="700" fontSize="sm" color={headingColor} mb={1.5}>
                      Rental Office Hours:
                    </Text>
                    <List spacing={1} fontSize="xs" color={textColor}>
                      <ListItem><ListIcon as={CheckCircleIcon} color="brand.500" /> Mon – Sat: 8:00 AM – 6:00 PM</ListItem>
                      <ListItem><ListIcon as={CheckCircleIcon} color="brand.500" /> Sunday: 11:00 AM – 6:00 PM</ListItem>
                      <ListItem><ListIcon as={CheckCircleIcon} color="brand.500" /> In-Town & One-Way Rentals</ListItem>
                      <ListItem><ListIcon as={CheckCircleIcon} color="brand.500" /> 24/7 Truck Share drop-off</ListItem>
                    </List>
                  </Box>
                </SimpleGrid>

                <Flex gap={3} wrap="wrap" align="center">
                  <Button
                    as="a"
                    href="https://www.uhaul.com/Locations/Truck-Rentals-near-Moravian-Falls-NC-28654/017013/"
                    target="_blank"
                    rel="noopener noreferrer"
                    colorScheme="orange"
                    bg="#EB5B28"
                    _hover={{ bg: '#d44919', transform: 'translateY(-2px)' }}
                    color="white"
                    size="md"
                    px={6}
                    onClick={handleUhaulClick}
                    rightIcon={<Box as="span">↗</Box>}
                  >
                    Book U-Haul Online
                  </Button>

                  <Button
                    as="a"
                    href="tel:13363040094"
                    variant="outline"
                    colorScheme="gray"
                    size="md"
                    onClick={() => track('phone_click', { location: 'services_uhaul' })}
                    leftIcon={<Box as="span">📞</Box>}
                  >
                    Reserve by Phone: (336) 304-0094
                  </Button>
                </Flex>
              </Box>

              <Box gridColumn={{ lg: 'span 5' }}>
                <Box
                  borderRadius="2xl"
                  overflow="hidden"
                  border="1px solid"
                  borderColor={cardBorder}
                  boxShadow="md"
                  h={{ base: '220px', md: '280px' }}
                >
                  <Image
                    src={uhaulImage?.src || getImagePath('/images/storeImages/04_uhaul_services.jpg')}
                    alt="U-Haul Truck Rentals at Holly Valley"
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    fallbackSrc={getImagePath('/images/misc/services-logo.png')}
                  />
                </Box>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Service 2: NC Lottery */}
          <Box
            p={{ base: 6, md: 8 }}
            bg={cardBg}
            borderRadius="2xl"
            border="1px solid"
            borderColor={cardBorder}
            boxShadow="md"
          >
            <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={8} alignItems="center">
              <Box gridColumn={{ lg: 'span 5' }} order={{ base: 2, lg: 1 }}>
                <Box
                  p={6}
                  borderRadius="2xl"
                  bg={subtleBg}
                  border="1px solid"
                  borderColor={cardBorder}
                  textAlign="center"
                >
                  <Box fontSize="3.5rem" mb={2}>🎟️</Box>
                  <Heading as="h3" fontSize="lg" fontWeight="800" color={headingColor} mb={2}>
                    Official NC Lottery Retailer
                  </Heading>
                  <Text fontSize="xs" color={textColor} mb={4}>
                    Moravian Falls authorized ticket sales & prize claims
                  </Text>
                  <HStack justify="center" spacing={2} wrap="wrap">
                    <Badge colorScheme="blue">Powerball</Badge>
                    <Badge colorScheme="purple">Mega Millions</Badge>
                    <Badge colorScheme="teal">Carolina Cash 5</Badge>
                    <Badge colorScheme="green">Scratch-Offs</Badge>
                  </HStack>
                </Box>
              </Box>

              <Box gridColumn={{ lg: 'span 7' }} order={{ base: 1, lg: 2 }}>
                <HStack spacing={2} mb={3}>
                  <Badge colorScheme="blue" px={3} py={1} borderRadius="full" fontSize="xs">
                    NC LOTTERY RETAILER
                  </Badge>
                  <Badge colorScheme="red" fontSize="xs">18+ ONLY</Badge>
                </HStack>

                <Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" color={headingColor} mb={3}>
                  🎟️ North Carolina Education Lottery
                </Heading>

                <Text color={textColor} fontSize="sm" lineHeight="1.7" mb={4}>
                  Holly Valley is an authorized NC Lottery retailer offering a full range of jackpot draw games and instant scratch-off tickets ranging from $1 to $50. All lottery sales strictly adhere to North Carolina state laws and regulations.
                </Text>

                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3} mb={5}>
                  <Box p={3} borderRadius="xl" bg={subtleBg} border="1px solid" borderColor={cardBorder}>
                    <Text fontWeight="700" fontSize="xs" color={headingColor} mb={1}>
                      Available Draw Games:
                    </Text>
                    <Text fontSize="xs" color={textColor}>
                      Mega Millions • Powerball • Lucky for Life • Carolina Cash 5 • Pick 3 & Pick 4
                    </Text>
                  </Box>

                  <Box p={3} borderRadius="xl" bg={subtleBg} border="1px solid" borderColor={cardBorder}>
                    <Text fontWeight="700" fontSize="xs" color={headingColor} mb={1}>
                      Age Verification:
                    </Text>
                    <Text fontSize="xs" color={textColor}>
                      Must be 18+ to purchase. Valid government photo ID required.
                    </Text>
                  </Box>
                </SimpleGrid>

                {/* Responsible Gaming Hotline */}
                <Box
                  p={3.5}
                  borderRadius="xl"
                  bg={gamblingBg}
                  border="1px solid"
                  borderColor={gamblingBorder}
                >
                  <Text fontSize="xs" fontWeight="700" color={gamblingTitleColor} mb={0.5}>
                    Responsible Gaming Resources:
                  </Text>
                  <Text fontSize="xs" color={gamblingSubColor}>
                    Set a budget and play for entertainment. If you or someone you know has a gambling problem, call <strong>1-800-522-4700</strong> or visit <ChakraLink href="https://www.nclottery.com" isExternal color="brand.500" fontWeight="bold">nclottery.com</ChakraLink>.
                  </Text>
                </Box>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Service 3: Accepted Payment Methods & EBT */}
          <Box
            p={{ base: 6, md: 8 }}
            bg={cardBg}
            borderRadius="2xl"
            border="1px solid"
            borderColor={cardBorder}
            boxShadow="md"
          >
            <HStack spacing={2} mb={3}>
              <Badge colorScheme="teal" px={3} py={1} borderRadius="full" fontSize="xs">
                PAYMENT METHODS
              </Badge>
              <Badge colorScheme="green" fontSize="xs">EBT Welcomed</Badge>
            </HStack>

            <Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" color={headingColor} mb={3}>
              💳 Accepted Forms of Payment & EBT
            </Heading>

            <Text color={textColor} fontSize="sm" lineHeight="1.7" maxW="3xl" mb={6}>
              We want your checkout experience to be smooth, fast, and convenient. We accept all major credit/debit cards, electronic benefits (EBT / SNAP), contactless mobile payments, and cash.
            </Text>

            <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing={3}>
              {paymentBadges.map((badge, idx) => (
                <Box
                  key={idx}
                  p={3.5}
                  borderRadius="xl"
                  bg={subtleBg}
                  border="1px solid"
                  borderColor={cardBorder}
                  textAlign="center"
                  transition="all 0.2s"
                  _hover={{ borderColor: 'brand.500', transform: 'translateY(-2px)' }}
                >
                  <Box fontSize="1.8rem" mb={1}>{badge.icon}</Box>
                  <Text fontWeight="700" fontSize="xs" color={headingColor}>
                    {badge.name}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* Service 4: ATM & Financial Services */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box
              p={6}
              bg={cardBg}
              borderRadius="2xl"
              border="1px solid"
              borderColor={cardBorder}
              boxShadow="md"
            >
              <Box fontSize="2.5rem" mb={3}>🏧</Box>
              <Heading as="h3" fontSize="lg" fontWeight="800" color={headingColor} mb={2}>
                On-Site Cash ATM
              </Heading>
              <Text fontSize="sm" color={textColor} lineHeight="1.6" mb={4}>
                Fast, secure cash withdrawals with low transaction fees. Operated in partnership with top-tier financial service providers to guarantee customer privacy, identity safety, and data security.
              </Text>
              <List spacing={1} fontSize="xs" color={textColor}>
                <ListItem><ListIcon as={CheckCircleIcon} color="brand.500" /> Compatible with all major debit/credit networks</ListItem>
                <ListItem><ListIcon as={CheckCircleIcon} color="brand.500" /> 24/7 store hours availability</ListItem>
                <ListItem><ListIcon as={CheckCircleIcon} color="brand.500" /> Low transaction fees</ListItem>
              </List>
            </Box>

            <Box
              p={6}
              bg={cardBg}
              borderRadius="2xl"
              border="1px solid"
              borderColor={cardBorder}
              boxShadow="md"
            >
              <Box fontSize="2.5rem" mb={3}>🪵</Box>
              <Heading as="h3" fontSize="lg" fontWeight="800" color={headingColor} mb={2}>
                Firewood, Bagged Ice & Propane
              </Heading>
              <Text fontSize="sm" color={textColor} lineHeight="1.6" mb={4}>
                Stock up on camping and household essentials. Premium seasoned firewood bundles for cozy fireplaces or campfires, various sizes of bagged ice, and seasonal supplies.
              </Text>
              <List spacing={1} fontSize="xs" color={textColor}>
                <ListItem><ListIcon as={CheckCircleIcon} color="brand.500" /> Quality seasoned firewood bundles</ListItem>
                <ListItem><ListIcon as={CheckCircleIcon} color="brand.500" /> Small & large party-sized ice bags</ListItem>
                <ListItem><ListIcon as={CheckCircleIcon} color="brand.500" /> Convenient loading right at storefront</ListItem>
              </List>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Services;