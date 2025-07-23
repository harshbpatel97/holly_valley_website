import React from 'react';
import { Box, Flex, HStack, IconButton, useDisclosure, Stack, Link as ChakraLink, Image, Spacer } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

const Links = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Products', to: '/products' },
  { label: 'Contact Us', to: '/contact' },
];

const NavLink = ({ to, children }) => (
  <ChakraLink
    as={Link}
    px={3}
    py={2}
    rounded={'md'}
    _hover={{ textDecoration: 'none', bg: 'gray.200', color: 'teal.600' }}
    _dark={{ _hover: { bg: 'gray.700', color: 'teal.200' } }}
    to={to}
  >
    {children}
  </ChakraLink>
);

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();

  return (
    <Box bg="beige" px={4} boxShadow="sm">
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <HStack spacing={4} alignItems={'center'}>
          <Image src="/images/misc/holly_valley_logo.png" alt="Holly Valley Logo" boxSize="50px" />
          <Box fontWeight="bold" fontSize="xl">HOLLY VALLEY</Box>
        </HStack>
        <Spacer />
        <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
          {Links.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
          <DarkModeToggle />
        </HStack>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
          ml={2}
        />
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {Links.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
            <DarkModeToggle />
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
} 