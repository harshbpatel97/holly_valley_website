import React from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Text,
  HStack,
  VStack,
  Flex,
  Image,
  Link as ChakraLink,
  Divider,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import StoreStatusBadge from './StoreStatusBadge';
import { track } from '../utils/ga';
import './Footer.css';

const Footer = () => {
  const onNavClick = (label, path) => track('nav_link_click', { link_text: label, location: 'footer', path });
  const onPhoneClick = () => track('phone_click', { location: 'footer' });
  const onDirectionsClick = () => track('directions_click', { provider: 'google_maps', location: 'footer' });

  const bg = useColorModeValue('gray.100', '#070B11');
  const borderColor = useColorModeValue('gray.200', '#1E293B');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.900', 'white');
  const linkHoverColor = useColorModeValue('brand.600', 'brand.300');
  const logoBoxBg = useColorModeValue('white', 'rgba(255, 255, 255, 0.05)');
  const gambleBoxBg = useColorModeValue('white', 'rgba(255, 255, 255, 0.03)');
  const gambleTextColor = useColorModeValue('gray.700', 'gray.300');

  return (
    <Box as="footer" bg={bg} borderTop="1px solid" borderColor={borderColor} pt={12} pb={8} mt="auto">
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8} mb={10}>
          {/* Column 1: Brand & Status */}
          <VStack align="flex-start" spacing={4}>
            <HStack spacing={3} alignItems="center">
              <Box
                p={1.5}
                bg={logoBoxBg}
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
              >
                <Image
                  src="/images/misc/holly_valley_logo.png"
                  alt="Holly Valley"
                  boxSize="36px"
                  objectFit="contain"
                  fallbackSrc="/images/misc/logo_transparent.png"
                />
              </Box>
              <Box>
                <Text fontWeight="800" fontSize="lg" color={headingColor} lineHeight="1.1">
                  HOLLY VALLEY
                </Text>
                <Text fontSize="xs" color={textColor} fontWeight="500">
                  Convenience & Service Hub
                </Text>
              </Box>
            </HStack>

            <Text fontSize="sm" color={textColor} lineHeight="1.6">
              Your trusted neighborhood convenience store in Moravian Falls, NC. Providing quality groceries, cold drinks, U-Haul rentals, NC Lottery, and friendly local service.
            </Text>

            <Box pt={1}>
              <StoreStatusBadge showFullText size="sm" />
            </Box>
          </VStack>

          {/* Column 2: Quick Links */}
          <VStack align="flex-start" spacing={3}>
            <Text fontWeight="700" fontSize="sm" color={headingColor} textTransform="uppercase" letterSpacing="0.05em">
              Quick Links
            </Text>
            <VStack align="flex-start" spacing={2} fontSize="sm">
              <ChakraLink
                as={Link}
                to="/"
                color={textColor}
                _hover={{ color: linkHoverColor }}
                onClick={() => onNavClick('Home', '/')}
              >
                Home
              </ChakraLink>
              <ChakraLink
                as={Link}
                to="/products"
                color={textColor}
                _hover={{ color: linkHoverColor }}
                onClick={() => onNavClick('Products', '/products')}
              >
                Products & Beverages
              </ChakraLink>
              <ChakraLink
                as={Link}
                to="/services"
                color={textColor}
                _hover={{ color: linkHoverColor }}
                onClick={() => onNavClick('Services', '/services')}
              >
                Services & U-Haul
              </ChakraLink>
              <ChakraLink
                as={Link}
                to="/contact"
                color={textColor}
                _hover={{ color: linkHoverColor }}
                onClick={() => onNavClick('Contact Us', '/contact')}
              >
                Contact & Directions
              </ChakraLink>
              <ChakraLink
                href="https://www.uhaul.com/Locations/Truck-Rentals-near-Moravian-Falls-NC-28654/017013/"
                isExternal
                color="brand.500"
                fontWeight="600"
                _hover={{ color: linkHoverColor, textDecoration: 'underline' }}
                onClick={() => onNavClick('U-Haul Online', 'https://www.uhaul.com/Locations/Truck-Rentals-near-Moravian-Falls-NC-28654/017013/')}
              >
                Reserve U-Haul Online ↗
              </ChakraLink>
            </VStack>
          </VStack>

          {/* Column 3: Store Info & Hours */}
          <VStack align="flex-start" spacing={3}>
            <Text fontWeight="700" fontSize="sm" color={headingColor} textTransform="uppercase" letterSpacing="0.05em">
              Hours & Location
            </Text>
            <VStack align="flex-start" spacing={1.5} fontSize="sm" color={textColor}>
              <Text fontWeight="600" color={headingColor}>Operating Hours:</Text>
              <Text>Mon – Sat: 8:00 AM – 8:00 PM</Text>
              <Text>Sunday: 11:00 AM – 7:30 PM</Text>
              <Box pt={2}>
                <Text fontWeight="600" color={headingColor}>Store Address:</Text>
                <Text>2730 NC Hwy 18 S</Text>
                <Text>Moravian Falls, NC 28654</Text>
              </Box>
              <HStack spacing={3} pt={2}>
                <ChakraLink
                  href="tel:13363040094"
                  color="brand.500"
                  fontWeight="600"
                  _hover={{ textDecoration: 'underline' }}
                  onClick={onPhoneClick}
                >
                  📞 (336) 304-0094
                </ChakraLink>
              </HStack>
            </VStack>
          </VStack>

          {/* Column 4: Legal, Compliance & Responsible Gaming */}
          <VStack align="flex-start" spacing={3}>
            <Text fontWeight="700" fontSize="sm" color={headingColor} textTransform="uppercase" letterSpacing="0.05em">
              Compliance & Safety
            </Text>
            <VStack align="flex-start" spacing={2} fontSize="xs" color={textColor}>
              <HStack spacing={1}>
                <Badge colorScheme="red" fontSize="10px">21+ ONLY</Badge>
                <Text>Tobacco & Alcohol</Text>
              </HStack>
              <HStack spacing={1}>
                <Badge colorScheme="blue" fontSize="10px">18+ ONLY</Badge>
                <Text>NC Lottery Games</Text>
              </HStack>
              <Text pt={1}>
                Valid government-issued photo ID required for all age-restricted purchases.
              </Text>
              <Box
                p={2.5}
                bg={gambleBoxBg}
                borderRadius="md"
                border="1px solid"
                borderColor={borderColor}
                w="100%"
              >
                <Text fontWeight="600" color={gambleTextColor}>
                  Gambling Problem?
                </Text>
                <Text mt={0.5}>
                  Call <ChakraLink href="tel:18005224700" fontWeight="bold" color="amber.500">1-800-522-4700</ChakraLink> or visit <ChakraLink href="https://www.nclottery.com" isExternal color="brand.500">nclottery.com</ChakraLink>
                </Text>
              </Box>
            </VStack>
          </VStack>
        </SimpleGrid>

        <Divider borderColor={borderColor} my={6} />

        {/* Bottom Bar */}
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align="center"
          fontSize="xs"
          color={textColor}
          gap={3}
        >
          <Text>
            © {new Date().getFullYear()} DBA Holly Valley. All rights reserved. Moravian Falls, North Carolina.
          </Text>
          <HStack spacing={4}>
            <ChakraLink
              as="a"
              href="https://www.google.com/maps/search/?api=1&query=Holly+Valley,2730+NC+Hwy+18+S,Moravian+Falls,NC+28654"
              target="_blank"
              rel="noopener noreferrer"
              _hover={{ color: linkHoverColor }}
              onClick={onDirectionsClick}
            >
              Get Directions
            </ChakraLink>
            <Text>•</Text>
            <ChakraLink as={Link} to="/services" _hover={{ color: linkHoverColor }}>
              U-Haul Dealer
            </ChakraLink>
            <Text>•</Text>
            <ChakraLink as={Link} to="/contact" _hover={{ color: linkHoverColor }}>
              Store Info
            </ChakraLink>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;