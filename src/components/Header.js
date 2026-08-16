import React from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Image,
  Button,
  useColorModeValue,
  Container,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  Text,
  Divider,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import StoreStatusBadge from './StoreStatusBadge';
import { track } from '../utils/ga';
import './Header.css';

const Links = [
  { label: 'Home', to: '/', icon: '🏪' },
  { label: 'Products', to: '/products', icon: '🛒' },
  { label: 'Services & U-Haul', to: '/services', icon: '🚚' },
  { label: 'Contact & Hours', to: '/contact', icon: '📍' },
];

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();

  const navBg = useColorModeValue('rgba(255, 255, 255, 0.85)', 'rgba(11, 15, 23, 0.85)');
  const borderColor = useColorModeValue('rgba(226, 232, 240, 0.8)', 'rgba(39, 53, 79, 0.8)');
  const activeBg = useColorModeValue('brand.50', 'rgba(13, 148, 136, 0.2)');
  const activeColor = useColorModeValue('brand.600', 'brand.300');
  const inactiveColor = useColorModeValue('gray.600', 'gray.300');
  const hoverBg = useColorModeValue('gray.100', 'rgba(255, 255, 255, 0.06)');
  const logoBoxBg = useColorModeValue('brand.50', 'rgba(13, 148, 136, 0.15)');
  const logoBorderColor = useColorModeValue('brand.100', 'rgba(13, 148, 136, 0.3)');
  const brandTitleColor = useColorModeValue('gray.900', 'white');
  const brandSubColor = useColorModeValue('gray.500', 'gray.400');
  const navHoverTextColor = useColorModeValue('gray.900', 'white');
  const drawerBg = useColorModeValue('white', '#131C2E');
  const drawerColor = useColorModeValue('gray.800', 'gray.100');

  const handleNavClick = (link, locLabel) => {
    track('nav_link_click', { link_text: link.label, location: locLabel, path: link.to });
    onClose();
  };

  const handlePhoneClick = () => {
    track('phone_click', { location: 'header' });
  };

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={100}
      bg={navBg}
      borderBottom="1px solid"
      borderColor={borderColor}
      className="glass-header"
      transition="all 0.2s ease"
    >
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
        <Flex h={{ base: '70px', md: '76px' }} alignItems="center" justifyContent="space-between">
          {/* Logo and Brand Title */}
          <Link to="/" onClick={() => track('nav_link_click', { link_text: 'Logo', location: 'header', path: '/' })}>
            <HStack spacing={3} alignItems="center">
              <Box
                position="relative"
                p={1.5}
                bg={logoBoxBg}
                borderRadius="xl"
                border="1px solid"
                borderColor={logoBorderColor}
              >
                <Image
                  src="/images/misc/holly_valley_logo.png"
                  alt="Holly Valley Logo"
                  boxSize={{ base: '38px', md: '44px' }}
                  objectFit="contain"
                  fallbackSrc="/images/misc/logo_transparent.png"
                />
              </Box>
              <Box>
                <Text
                  fontWeight="800"
                  fontSize={{ base: 'lg', md: 'xl' }}
                  letterSpacing="-0.02em"
                  lineHeight="1.1"
                  color={brandTitleColor}
                >
                  HOLLY VALLEY
                </Text>
                <Text
                  fontSize="xs"
                  fontWeight="500"
                  color={brandSubColor}
                  letterSpacing="0.05em"
                  textTransform="uppercase"
                >
                  Moravian Falls, NC
                </Text>
              </Box>
            </HStack>
          </Link>

          {/* Desktop Live Status Badge */}
          <Box display={{ base: 'none', lg: 'block' }}>
            <StoreStatusBadge showFullText size="sm" />
          </Box>

          {/* Desktop Navigation Links */}
          <HStack as="nav" spacing={1} display={{ base: 'none', md: 'flex' }} alignItems="center">
            {Links.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Button
                  key={link.to}
                  as={Link}
                  to={link.to}
                  variant="ghost"
                  size="sm"
                  px={3.5}
                  py={2}
                  height="auto"
                  fontWeight={isActive ? '700' : '500'}
                  fontSize="sm"
                  color={isActive ? activeColor : inactiveColor}
                  bg={isActive ? activeBg : 'transparent'}
                  borderRadius="lg"
                  _hover={{
                    bg: isActive ? activeBg : hoverBg,
                    color: isActive ? activeColor : navHoverTextColor,
                    textDecoration: 'none',
                  }}
                  onClick={() => handleNavClick(link, 'header')}
                >
                  {link.label}
                </Button>
              );
            })}
          </HStack>

          {/* Right Action Cluster */}
          <HStack spacing={2} alignItems="center">
            <Button
              as="a"
              href="tel:13363040094"
              size="sm"
              colorScheme="brand"
              bg="brand.500"
              color="white"
              _hover={{ bg: 'brand.600' }}
              display={{ base: 'none', sm: 'inline-flex' }}
              borderRadius="lg"
              fontWeight="600"
              onClick={handlePhoneClick}
              leftIcon={<Box as="span">📞</Box>}
            >
              (336) 304-0094
            </Button>

            <DarkModeToggle />

            {/* Mobile Hamburger Button */}
            <IconButton
              size="md"
              icon={<HamburgerIcon />}
              aria-label="Open Navigation Menu"
              display={{ md: 'none' }}
              onClick={onOpen}
              variant="ghost"
              borderRadius="lg"
            />
          </HStack>
        </Flex>
      </Container>

      {/* Mobile Slide-Over Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay backdropFilter="blur(4px)" />
        <DrawerContent bg={drawerBg} color={drawerColor}>
          <DrawerCloseButton mt={2} />
          <DrawerHeader borderBottomWidth="1px" borderColor={borderColor} pt={6} pb={4}>
            <HStack spacing={3} alignItems="center">
              <Image
                src="/images/misc/holly_valley_logo.png"
                alt="Holly Valley Logo"
                boxSize="36px"
                objectFit="contain"
              />
              <Box>
                <Text fontWeight="800" fontSize="md" lineHeight="1.1">HOLLY VALLEY</Text>
                <Text fontSize="xs" color="gray.500" fontWeight="500">Convenience Store</Text>
              </Box>
            </HStack>
          </DrawerHeader>

          <DrawerBody py={6}>
            <VStack spacing={6} align="stretch">
              <Box>
                <StoreStatusBadge showFullText size="md" />
              </Box>

              <Stack as="nav" spacing={2}>
                {Links.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Button
                      key={link.to}
                      as={Link}
                      to={link.to}
                      justifyContent="flex-start"
                      variant="ghost"
                      size="lg"
                      py={4}
                      fontWeight={isActive ? '700' : '500'}
                      color={isActive ? activeColor : inactiveColor}
                      bg={isActive ? activeBg : 'transparent'}
                      borderRadius="xl"
                      leftIcon={<Box as="span" fontSize="lg" mr={2}>{link.icon}</Box>}
                      _hover={{ bg: hoverBg }}
                      onClick={() => handleNavClick(link, 'mobile-drawer')}
                    >
                      {link.label}
                    </Button>
                  );
                })}
              </Stack>

              <Divider borderColor={borderColor} />

              {/* Quick Mobile Action Buttons */}
              <VStack spacing={3}>
                <Button
                  as="a"
                  href="tel:13363040094"
                  w="100%"
                  colorScheme="brand"
                  bg="brand.500"
                  color="white"
                  borderRadius="xl"
                  py={6}
                  leftIcon={<Box as="span">📞</Box>}
                  onClick={handlePhoneClick}
                >
                  Call Store: (336) 304-0094
                </Button>

                <Button
                  as="a"
                  href="https://www.google.com/maps/search/?api=1&query=Holly+Valley,2730+NC+Hwy+18+S,Moravian+Falls,NC+28654"
                  target="_blank"
                  rel="noopener noreferrer"
                  w="100%"
                  variant="outline"
                  borderRadius="xl"
                  py={6}
                  leftIcon={<Box as="span">📍</Box>}
                  onClick={() => track('directions_click', { provider: 'google_maps', location: 'mobile_menu' })}
                >
                  Get Directions
                </Button>
              </VStack>

              {/* Mobile Footer Note */}
              <Box pt={4} textAlign="center">
                <Text fontSize="xs" color="gray.500">
                  2730 NC Hwy 18 S, Moravian Falls, NC
                </Text>
                <Text fontSize="xs" color="gray.400" mt={1}>
                  Mon–Sat: 8AM–8PM • Sun: 11AM–7:30PM
                </Text>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}