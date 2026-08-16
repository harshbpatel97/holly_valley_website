import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  HStack,
  VStack,
  Flex,
  Badge,
  useColorModeValue,
  Spinner,
  useToast,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useStoreImages, sliderConfig } from '../config/storeImages';
import StoreStatusBadge from './StoreStatusBadge';
import { AppleMapsIcon, GoogleMapsIcon } from './MapIcons';
import { STORE_SCHEDULE, getStoreStatus } from '../utils/storeHours';
import { track } from '../utils/ga';
import './Home.css';

const servicesHighlights = [
  {
    icon: '🛒',
    title: 'Groceries & Snacks',
    description: 'Pantry staples, fresh snacks, ice cream, frozen treats, and daily household items.',
    link: '/products',
    tag: 'Everyday Essentials',
  },
  {
    icon: '🥤',
    title: 'Cold Drinks & Ice',
    description: 'Massive selection of sodas, energy drinks, teas, juices, and bagged ice for any occasion.',
    link: '/products',
    tag: 'Refreshing Variety',
  },
  {
    icon: '🚚',
    title: 'U-Haul Truck & Trailer',
    description: 'Official Neighborhood Dealer offering moving trucks, cargo trailers, and moving supplies.',
    link: 'https://www.uhaul.com/Locations/Truck-Rentals-near-Moravian-Falls-NC-28654/017013/',
    isExternal: true,
    tag: 'Authorized Dealer',
  },
  {
    icon: '🎟️',
    title: 'NC Lottery Retailer',
    description: 'Authorized retailer for Powerball, Mega Millions, Cash 5, and instant scratch-off tickets (18+).',
    link: '/services',
    tag: 'Play Responsibly (18+)',
  },
  {
    icon: '💳',
    title: 'EBT & All Payments',
    description: 'We gladly accept EBT/SNAP, all major credit cards, debit, contactless Apple Pay, and cash.',
    link: '/services',
    tag: 'EBT Accepted',
  },
  {
    icon: '🏧',
    title: 'On-Site ATM & Bitcoin',
    description: 'Secure, low-fee ATM cash withdrawals and Bitcoin terminal for quick, reliable financial access.',
    link: '/services',
    tag: 'Safe & Secure',
  },
];

const Home = () => {
  const { storeImages, loading, error } = useStoreImages();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [storeStatus, setStoreStatus] = useState(getStoreStatus());
  const toast = useToast();

  const cardBg = useColorModeValue('white', '#131C2E');
  const cardBorder = useColorModeValue('gray.200', '#27354F');
  const subtleBg = useColorModeValue('gray.50', '#0E1626');
  const headingColor = useColorModeValue('gray.900', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const accentTeal = useColorModeValue('brand.600', 'brand.400');
  const heroGradient = useColorModeValue('linear(to-b, brand.50, transparent)', 'linear(to-b, rgba(13, 148, 136, 0.1), transparent)');
  const todayScheduleBg = useColorModeValue('brand.50', 'rgba(13, 148, 136, 0.15)');
  const carouselPlaceholderBg = useColorModeValue('gray.100', '#0E1626');
  const uhaulColor = useColorModeValue('#D9480F', '#FF7A45');

  // Auto-play carousel
  useEffect(() => {
    if (!sliderConfig.autoPlay || loading || storeImages.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % storeImages.length);
    }, sliderConfig.autoPlayInterval || 5000);

    return () => clearInterval(interval);
  }, [loading, storeImages, isPaused]);

  // Update store status every minute
  useEffect(() => {
    const timer = setInterval(() => setStoreStatus(getStoreStatus()), 60000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    if (storeImages.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % storeImages.length);
  };

  const prevSlide = () => {
    if (storeImages.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + storeImages.length) % storeImages.length);
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
    track('copy_address_click', { location: 'home' });
  };

  return (
    <Box className="home-page" pb={16}>
      {/* 1. Hero Section */}
      <Box
        position="relative"
        overflow="hidden"
        pt={{ base: 8, md: 14 }}
        pb={{ base: 10, md: 16 }}
        bgGradient={heroGradient}
      >
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={{ base: 8, lg: 12 }} alignItems="center">
            {/* Left Hero Content */}
            <Box gridColumn={{ lg: 'span 7' }}>
              <HStack spacing={2} mb={4} wrap="wrap">
                <Badge colorScheme="teal" px={3} py={1} borderRadius="full" fontSize="xs">
                  🏪 MORAVIAN FALLS, NC
                </Badge>
                <StoreStatusBadge showFullText size="sm" />
              </HStack>

              <Heading
                as="h1"
                fontSize={{ base: '2.5rem', sm: '3.2rem', md: '3.8rem' }}
                fontWeight="800"
                lineHeight="1.1"
                letterSpacing="-0.03em"
                color={headingColor}
                mb={5}
              >
                Your Friendly Local{' '}
                <Text as="span" color="brand.500" bgGradient="linear(to-r, brand.500, teal.400)" bgClip="text">
                  Convenience & Service
                </Text>{' '}
                Hub
              </Heading>

              <Text fontSize={{ base: 'md', md: 'lg' }} color={textColor} mb={8} maxW="2xl" lineHeight="1.7">
                Holly Valley offers fresh groceries, ice-cold beverages, firewood, bagged ice, authorized NC Lottery games, EBT acceptance, on-site ATM, and official U-Haul truck & trailer rentals in Moravian Falls, NC.
              </Text>

              {/* Action Buttons */}
              <Flex gap={3} wrap="wrap" mb={8}>
                <Button
                  as="a"
                  href="https://www.google.com/maps/search/?api=1&query=Holly+Valley,2730+NC+Hwy+18+S,Moravian+Falls,NC+28654"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  colorScheme="brand"
                  bg="brand.500"
                  color="white"
                  _hover={{ bg: 'brand.600', transform: 'translateY(-2px)' }}
                  px={6}
                  leftIcon={<Box as="span">📍</Box>}
                  onClick={() => track('directions_click', { provider: 'google_maps', location: 'hero' })}
                >
                  Get Directions
                </Button>

                <Button
                  as="a"
                  href="tel:13363040094"
                  size="lg"
                  variant="outline"
                  borderColor={cardBorder}
                  bg={cardBg}
                  _hover={{ bg: subtleBg, transform: 'translateY(-2px)' }}
                  px={6}
                  leftIcon={<Box as="span">📞</Box>}
                  onClick={() => track('phone_click', { location: 'hero' })}
                >
                  (336) 304-0094
                </Button>

                <Button
                  as="a"
                  href="https://www.uhaul.com/Locations/Truck-Rentals-near-Moravian-Falls-NC-28654/017013/"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  variant="ghost"
                  colorScheme="orange"
                  color={uhaulColor}
                  px={5}
                  rightIcon={<Box as="span">🚚</Box>}
                  onClick={() => track('uhaul_booking_click', { destination: 'https://www.uhaul.com/Locations/Truck-Rentals-near-Moravian-Falls-NC-28654/017013/', location: 'home_hero' })}
                >
                  Rent U-Haul
                </Button>
              </Flex>

              {/* Quick Store Feature Badges */}
              <HStack spacing={4} wrap="wrap" color={textColor} fontSize="xs" fontWeight="600">
                <HStack spacing={1}>
                  <Text color="brand.500">✓</Text>
                  <Text>Open 7 Days a Week</Text>
                </HStack>
                <HStack spacing={1}>
                  <Text color="brand.500">✓</Text>
                  <Text>EBT / SNAP Accepted</Text>
                </HStack>
                <HStack spacing={1}>
                  <Text color="brand.500">✓</Text>
                  <Text>U-Haul Dealer</Text>
                </HStack>
                <HStack spacing={1}>
                  <Text color="brand.500">✓</Text>
                  <Text>Free Easy Parking</Text>
                </HStack>
              </HStack>
            </Box>

            {/* Right Hero: Store Images Carousel */}
            <Box gridColumn={{ lg: 'span 5' }}>
              <Box
                className="modern-carousel"
                position="relative"
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="2xl"
                border="1px solid"
                borderColor={cardBorder}
                bg={carouselPlaceholderBg}
                h={{ base: '260px', sm: '320px', md: '380px' }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {loading ? (
                  <Flex h="100%" align="center" justify="center" direction="column" gap={3}>
                    <Spinner size="xl" color="brand.500" thickness="3px" />
                    <Text fontSize="sm" color={textColor}>Loading store showcase...</Text>
                  </Flex>
                ) : error || storeImages.length === 0 ? (
                  <Flex h="100%" align="center" justify="center" direction="column" p={6} textAlign="center">
                    <Box fontSize="3xl" mb={2}>🏪</Box>
                    <Text fontWeight="bold">Holly Valley Store</Text>
                    <Text fontSize="xs" color={textColor} mt={1}>2730 NC Hwy 18 S, Moravian Falls</Text>
                  </Flex>
                ) : (
                  <>
                    {storeImages.map((slide, index) => (
                      <Box
                        key={slide.id || index}
                        position="absolute"
                        top={0}
                        left={0}
                        w="100%"
                        h="100%"
                        opacity={index === currentSlide ? 1 : 0}
                        transition="opacity 0.8s ease-in-out, transform 1.2s ease"
                        transform={index === currentSlide ? 'scale(1)' : 'scale(1.04)'}
                        pointerEvents={index === currentSlide ? 'auto' : 'none'}
                      >
                        <img
                          src={slide.src}
                          alt={slide.alt || 'Holly Valley Store'}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <Box
                          position="absolute"
                          bottom={0}
                          left={0}
                          right={0}
                          p={4}
                          bgGradient="linear(to-t, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)"
                          color="white"
                        >
                          <Text fontWeight="800" fontSize="sm" textTransform="uppercase" letterSpacing="0.06em">
                            {slide.title || 'HOLLY VALLEY STORE VIEW'}
                          </Text>
                          <Text fontSize="xs" opacity={0.85} textTransform="uppercase" letterSpacing="0.05em">
                            MORAVIAN FALLS, NC
                          </Text>
                        </Box>
                      </Box>
                    ))}

                    {/* Carousel Navigation Buttons */}
                    {storeImages.length > 1 && (
                      <>
                        <Button
                          position="absolute"
                          top="50%"
                          left={3}
                          transform="translateY(-50%)"
                          size="sm"
                          borderRadius="full"
                          bg="rgba(0, 0, 0, 0.4)"
                          color="white"
                          _hover={{ bg: 'rgba(0, 0, 0, 0.7)' }}
                          onClick={prevSlide}
                          aria-label="Previous Slide"
                          minW="32px"
                          h="32px"
                          p={0}
                        >
                          ‹
                        </Button>
                        <Button
                          position="absolute"
                          top="50%"
                          right={3}
                          transform="translateY(-50%)"
                          size="sm"
                          borderRadius="full"
                          bg="rgba(0, 0, 0, 0.4)"
                          color="white"
                          _hover={{ bg: 'rgba(0, 0, 0, 0.7)' }}
                          onClick={nextSlide}
                          aria-label="Next Slide"
                          minW="32px"
                          h="32px"
                          p={0}
                        >
                          ›
                        </Button>

                        {/* Navigation Dots */}
                        <HStack
                          position="absolute"
                          bottom={3}
                          right={4}
                          spacing={1.5}
                          zIndex={2}
                        >
                          {storeImages.map((_, idx) => (
                            <Box
                              key={idx}
                              w={idx === currentSlide ? '18px' : '6px'}
                              h="6px"
                              borderRadius="full"
                              bg={idx === currentSlide ? 'brand.400' : 'whiteAlpha.600'}
                              cursor="pointer"
                              transition="all 0.3s ease"
                              onClick={() => setCurrentSlide(idx)}
                            />
                          ))}
                        </HStack>
                      </>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* 2. Services & Offerings Grid */}
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} pt={12} pb={14}>
        <VStack spacing={3} textAlign="center" mb={10}>
          <Badge colorScheme="teal" px={3} py={1} borderRadius="full">
            WHAT WE OFFER
          </Badge>
          <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="800" color={headingColor}>
            Everything You Need, All in One Stop
          </Heading>
          <Text color={textColor} maxW="2xl">
            From daily pantry staples and icy drinks to authorized U-Haul truck rentals and NC Lottery games, we're dedicated to serving our community.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
          {servicesHighlights.map((item, index) => (
            <Box
              key={index}
              p={6}
              bg={cardBg}
              borderRadius="2xl"
              border="1px solid"
              borderColor={cardBorder}
              boxShadow="sm"
              transition="all 0.25s ease"
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: 'xl',
                borderColor: 'brand.500',
              }}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Box>
                <Flex justify="space-between" align="center" mb={4}>
                  <Box
                    fontSize="2.2rem"
                    w="52px"
                    h="52px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="xl"
                    bg={subtleBg}
                  >
                    {item.icon}
                  </Box>
                  <Badge colorScheme="brand" variant="subtle" fontSize="10px">
                    {item.tag}
                  </Badge>
                </Flex>

                <Heading as="h3" fontSize="lg" fontWeight="700" color={headingColor} mb={2}>
                  {item.title}
                </Heading>

                <Text fontSize="sm" color={textColor} lineHeight="1.6" mb={4}>
                  {item.description}
                </Text>
              </Box>

              {item.isExternal ? (
                <ChakraLink
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  fontSize="xs"
                  fontWeight="700"
                  color={accentTeal}
                  _hover={{ textDecoration: 'underline' }}
                  display="inline-flex"
                  alignItems="center"
                  gap={1}
                  onClick={() => track('uhaul_booking_click', { destination: item.link, location: 'home_card' })}
                >
                  Book Online <span>↗</span>
                </ChakraLink>
              ) : (
                <ChakraLink
                  as={Link}
                  to={item.link}
                  fontSize="xs"
                  fontWeight="700"
                  color={accentTeal}
                  _hover={{ textDecoration: 'underline' }}
                  display="inline-flex"
                  alignItems="center"
                  gap={1}
                >
                  Learn More <span>→</span>
                </ChakraLink>
              )}
            </Box>
          ))}
        </SimpleGrid>
      </Container>

      {/* 3. Hours & Location Split Section */}
      <Box bg={subtleBg} py={14} borderY="1px solid" borderColor={cardBorder}>
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={8} alignItems="stretch">
            {/* Left: Interactive Weekly Hours */}
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
              <Box>
                <HStack justify="space-between" align="center" mb={3}>
                  <Heading as="h3" fontSize="xl" fontWeight="800" color={headingColor}>
                    Store Hours
                  </Heading>
                  <StoreStatusBadge showFullText={false} size="sm" />
                </HStack>
                <Text fontSize="xs" color={textColor} mb={5}>
                  Open 7 days a week for your convenience.
                </Text>

                {/* Day-by-Day Schedule List */}
                <VStack spacing={2} align="stretch">
                  {STORE_SCHEDULE.map((item, idx) => {
                    const isToday = idx === storeStatus.currentDayIndex;
                    return (
                      <Flex
                        key={item.day}
                        justify="space-between"
                        align="center"
                        p={2.5}
                        borderRadius="xl"
                        bg={isToday ? todayScheduleBg : 'transparent'}
                        border={isToday ? '1px solid' : '1px solid transparent'}
                        borderColor={isToday ? 'brand.500' : 'transparent'}
                        fontWeight={isToday ? '700' : '500'}
                        fontSize="sm"
                      >
                        <HStack spacing={2}>
                          <Text color={isToday ? 'brand.500' : headingColor}>{item.day}</Text>
                          {isToday && (
                            <Badge colorScheme="brand" fontSize="9px" px={1.5} py={0.5}>
                              TODAY
                            </Badge>
                          )}
                        </HStack>
                        <Text color={isToday ? 'brand.500' : textColor}>{item.text}</Text>
                      </Flex>
                    );
                  })}
                </VStack>
              </Box>

              <Box pt={5} borderTop="1px solid" borderColor={cardBorder} mt={4}>
                <HStack justify="space-between" fontSize="xs" color={textColor}>
                  <Text>Have a question before visiting?</Text>
                  <ChakraLink
                    href="tel:13363040094"
                    color="brand.500"
                    fontWeight="700"
                    onClick={() => track('phone_click', { location: 'hours_card' })}
                  >
                    Call Us
                  </ChakraLink>
                </HStack>
              </Box>
            </Box>

            {/* Right: Location & Interactive Map Card */}
            <Box
              gridColumn={{ lg: 'span 7' }}
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
              <Box mb={4}>
                <Flex justify="space-between" align="center" wrap="wrap" gap={2} mb={2}>
                  <Heading as="h3" fontSize="xl" fontWeight="800" color={headingColor}>
                    Location & Directions
                  </Heading>
                  <Button
                    size="xs"
                    variant="outline"
                    colorScheme="brand"
                    onClick={copyAddress}
                    leftIcon={<Box as="span">📋</Box>}
                  >
                    Copy Address
                  </Button>
                </Flex>

                <Text fontSize="sm" color={textColor} mb={1}>
                  <strong>Holly Valley:</strong> 2730 NC Hwy 18 S, Moravian Falls, NC 28654
                </Text>
                <Text fontSize="xs" color={textColor}>
                  Conveniently situated on NC Hwy 18 S with ample customer parking and trailer turnaround space.
                </Text>
              </Box>

              {/* Embedded Google Map */}
              <Box
                borderRadius="xl"
                overflow="hidden"
                border="1px solid"
                borderColor={cardBorder}
                h={{ base: '220px', sm: '260px', md: '280px' }}
                position="relative"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d51576.80827655196!2d-81.22339562721537!3d36.10444355488105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x885113264059d395%3A0xa1eb466dc155b46d!2sHolly%20Valley!5e0!3m2!1sen!2sus!4v1639761501521!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Holly Valley Store Location Map"
                />
              </Box>

              <Flex justify="space-between" align="center" pt={4} mt={2} wrap="wrap" gap={2}>
                <Button
                  as="a"
                  href="https://www.google.com/maps/search/?api=1&query=Holly+Valley,2730+NC+Hwy+18+S,Moravian+Falls,NC+28654"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  colorScheme="brand"
                  bg="brand.500"
                  color="white"
                  _hover={{ bg: 'brand.600' }}
                  leftIcon={<GoogleMapsIcon />}
                  onClick={() => track('directions_click', { provider: 'google_maps', location: 'map_card' })}
                >
                  Open in Google Maps
                </Button>

                <Button
                  as="a"
                  href="https://maps.apple.com/?q=Holly+Valley,2730+NC+Hwy+18+S,Moravian+Falls,NC+28654"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  variant="outline"
                  leftIcon={<AppleMapsIcon />}
                  onClick={() => track('directions_click', { provider: 'apple_maps', location: 'map_card' })}
                >
                  Apple Maps
                </Button>
              </Flex>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* 4. About Us & Community Commitment */}
      <Container maxW="5xl" px={{ base: 4, sm: 6 }} pt={14}>
        <Box
          p={{ base: 6, md: 10 }}
          borderRadius="3xl"
          bg={cardBg}
          border="1px solid"
          borderColor={cardBorder}
          boxShadow="lg"
          textAlign="center"
        >
          <Badge colorScheme="teal" px={3} py={1} borderRadius="full" mb={3}>
            ABOUT HOLLY VALLEY
          </Badge>
          <Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" color={headingColor} mb={4}>
            Dedicated to Serving Moravian Falls & Wilkes County
          </Heading>
          <Text color={textColor} fontSize="md" lineHeight="1.8" maxW="3xl" mx="auto" mb={6}>
            Holly Valley is an independent, community-first convenience store committed to providing top-quality products, competitive prices, and friendly customer care. Whether you are grabbing morning coffee and snacks, refueling on cold drinks, renting a U-Haul for moving day, or trying your luck with NC Lottery games, our team is always ready to welcome you.
          </Text>
          <HStack justify="center" spacing={4} wrap="wrap">
            <Button as={Link} to="/products" colorScheme="brand" size="md">
              Browse Products
            </Button>
            <Button as={Link} to="/services" variant="outline" size="md">
              Explore All Services
            </Button>
          </HStack>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;