import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  HStack,
  Flex,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  useColorModeValue,
  Spinner,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useProductImages } from '../config/productImages';
import ProductCard from './ProductCard';
import { track } from '../utils/ga';
import './Products.css';

const brandPills = [
  'Coca-Cola', 'Pepsi', 'Red Bull', 'Monster Energy', 'Dr Pepper',
  "Dippin' Dots", "Ben & Jerry's", 'Gatorade', 'Frito-Lay', 'Jack Link’s',
  'Hostess', 'Arizona Iced Tea', 'Hershey’s', 'Snapple', 'Nestlé'
];

const Products = () => {
  const { categories, loading, error } = useProductImages();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomedProduct, setZoomedProduct] = useState(null);

  const cardBg = useColorModeValue('white', '#131C2E');
  const cardBorder = useColorModeValue('gray.200', '#27354F');
  const subtleBg = useColorModeValue('gray.50', '#0E1626');
  const headingColor = useColorModeValue('gray.900', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const activeTabBg = 'brand.500';
  const activeTabColor = 'white';
  const inactiveTabBg = useColorModeValue('gray.100', '#1A273F');
  const inactiveTabColor = useColorModeValue('gray.700', 'gray.300');
  const tabHoverInactiveBg = useColorModeValue('gray.200', '#27354F');
  const brandPillBg = useColorModeValue('white', 'rgba(255,255,255,0.03)');
  const calloutBg = useColorModeValue('brand.50', 'rgba(13, 148, 136, 0.12)');
  const calloutBorder = useColorModeValue('brand.200', 'rgba(13, 148, 136, 0.3)');
  const heroGradient = useColorModeValue('linear(to-b, brand.50, transparent)', 'linear(to-b, rgba(13, 148, 136, 0.1), transparent)');

  const rawProducts = Object.values(categories);

  // Flatten and filter items based on category & search query
  const filteredProducts = useMemo(() => {
    let list = [];
    rawProducts.forEach((cat) => {
      if (selectedCategory === 'all' || selectedCategory === cat.id) {
        if (cat.items && cat.items.length > 0) {
          cat.items.forEach((item) => {
            list.push({
              ...item,
              categoryId: cat.id,
              categoryTitle: cat.title,
            });
          });
        }
      }
    });

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.caption?.toLowerCase().includes(q) ||
          item.categoryTitle?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [rawProducts, selectedCategory, searchQuery]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    track('product_category_open', { category: catId });
  };

  const handleImageClick = (item) => {
    setZoomedProduct(item);
    track('product_image_zoom', { category: item.categoryId, item_caption: item.caption });
  };

  const closeZoom = () => {
    setZoomedProduct(null);
  };

  return (
    <Box className="products-page" pb={16}>
      {/* 1. Header & Intro */}
      <Box
        pt={{ base: 8, md: 12 }}
        pb={{ base: 8, md: 10 }}
        bgGradient={heroGradient}
      >
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} textAlign="center">
          <Badge colorScheme="teal" px={3} py={1} borderRadius="full" mb={3}>
            OUR INVENTORY & SELECTION
          </Badge>
          <Heading as="h1" fontSize={{ base: '2.5rem', md: '3.2rem' }} fontWeight="800" color={headingColor} mb={4}>
            Quality Products & Ice-Cold Beverages
          </Heading>
          <Text color={textColor} fontSize={{ base: 'md', md: 'lg' }} maxW="3xl" mx="auto">
            From daily pantry staples and grab-and-go snacks to ice bags, frozen pizza, Dippin' Dots, firewood bundles, and cold beverages — we keep our shelves stocked with top brands.
          </Text>

          {/* Popular Brands Marquee / Pills */}
          <Box mt={6} overflowX="auto" pb={2}>
            <HStack spacing={2} justify={{ base: 'flex-start', md: 'center' }} minW="max-content" px={2}>
              <Text fontSize="xs" fontWeight="700" color={textColor} textTransform="uppercase" mr={1}>
                Popular Brands:
              </Text>
              {brandPills.map((brand) => (
                <Badge
                  key={brand}
                  variant="outline"
                  colorScheme="gray"
                  fontSize="xs"
                  px={2.5}
                  py={0.5}
                  borderRadius="full"
                  bg={brandPillBg}
                >
                  {brand}
                </Badge>
              ))}
            </HStack>
          </Box>
        </Container>
      </Box>

      {/* 2. Filter Bar & Search */}
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
        <Box
          p={4}
          bg={cardBg}
          borderRadius="2xl"
          border="1px solid"
          borderColor={cardBorder}
          boxShadow="sm"
          mb={8}
        >
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'stretch', md: 'center' }}
            gap={4}
          >
            {/* Category Filter Pills */}
            <Flex wrap="wrap" gap={2}>
              <Button
                size="sm"
                borderRadius="xl"
                bg={selectedCategory === 'all' ? activeTabBg : inactiveTabBg}
                color={selectedCategory === 'all' ? activeTabColor : inactiveTabColor}
                _hover={{ bg: selectedCategory === 'all' ? 'brand.600' : tabHoverInactiveBg }}
                onClick={() => handleCategorySelect('all')}
              >
                All Products
              </Button>
              {rawProducts.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <Button
                    key={cat.id}
                    size="sm"
                    borderRadius="xl"
                    bg={isSelected ? activeTabBg : inactiveTabBg}
                    color={isSelected ? activeTabColor : inactiveTabColor}
                    _hover={{ bg: isSelected ? 'brand.600' : tabHoverInactiveBg }}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    {cat.title}
                  </Button>
                );
              })}
            </Flex>

            {/* Instant Search Bar */}
            <Box minW={{ base: '100%', md: '260px' }}>
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none">🔍</InputLeftElement>
                <Input
                  placeholder="Search products & brands..."
                  borderRadius="xl"
                  bg={subtleBg}
                  borderColor={cardBorder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Box>
          </Flex>
        </Box>

        {/* 3. Products Grid */}
        {loading ? (
          <Box py={16} textAlign="center">
            <Spinner size="xl" color="brand.500" thickness="3px" />
            <Text mt={4} color={textColor} fontWeight="600">Loading product catalog...</Text>
          </Box>
        ) : error ? (
          <Box p={8} textAlign="center" bg={cardBg} borderRadius="2xl" border="1px solid" borderColor="red.300">
            <Text color="red.500" fontWeight="bold" fontSize="lg">Unable to load Google Drive products</Text>
            <Text color={textColor} fontSize="sm" mt={2}>{error}</Text>
          </Box>
        ) : filteredProducts.length === 0 ? (
          <Box p={12} textAlign="center" bg={cardBg} borderRadius="2xl" border="1px solid" borderColor={cardBorder}>
            <Box fontSize="3xl" mb={2}>🔍</Box>
            <Heading as="h3" fontSize="lg" color={headingColor} mb={2}>
              No matching products found
            </Heading>
            <Text color={textColor} fontSize="sm" maxW="md" mx="auto" mb={4}>
              {searchQuery ? `No results for "${searchQuery}". Try a different keyword.` : 'Check back soon or visit our store in Moravian Falls for full stock.'}
            </Text>
            {(searchQuery || selectedCategory !== 'all') && (
              <Button
                size="sm"
                colorScheme="brand"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </Button>
            )}
          </Box>
        ) : (
          <>
            <HStack justify="space-between" mb={4} px={1}>
              <Text fontSize="xs" fontWeight="700" color={textColor} textTransform="uppercase">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
              </Text>
              {searchQuery && (
                <Badge colorScheme="brand" fontSize="xs">
                  Filter: "{searchQuery}"
                </Badge>
              )}
            </HStack>

            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
              {filteredProducts.map((item, index) => (
                <ProductCard
                  key={item.id || index}
                  image={item.src}
                  name={item.caption || `Product ${index + 1}`}
                  description={item.description}
                  category={item.categoryTitle}
                  categoryId={item.categoryId}
                  onClick={() => handleImageClick(item)}
                  index={index}
                />
              ))}
            </SimpleGrid>
          </>
        )}

        {/* In-Store Callout Banner */}
        <Box
          mt={14}
          p={{ base: 6, md: 8 }}
          borderRadius="2xl"
          bg={calloutBg}
          border="1px solid"
          borderColor={calloutBorder}
          textAlign="center"
        >
          <Heading as="h3" fontSize="xl" fontWeight="800" color={headingColor} mb={2}>
            Looking for something specific?
          </Heading>
          <Text color={textColor} fontSize="sm" maxW="2xl" mx="auto" mb={5}>
            We carry hundreds of additional grocery items, refreshing drinks, specialty snacks, dairy, automotive essentials, and seasonal goods in our Moravian Falls store. Call or visit us today!
          </Text>
          <HStack justify="center" spacing={4} wrap="wrap">
            <Button as="a" href="tel:13363040094" colorScheme="brand" size="md" leftIcon={<Box as="span">📞</Box>}>
              Call Store: (336) 304-0094
            </Button>
            <Button
              as="a"
              href="https://www.google.com/maps/search/?api=1&query=Holly+Valley,2730+NC+Hwy+18+S,Moravian+Falls,NC+28654"
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="md"
              leftIcon={<Box as="span">📍</Box>}
            >
              Get Driving Directions
            </Button>
          </HStack>
        </Box>
      </Container>

      {/* 4. Zoom Modal Lightbox */}
      <Modal isOpen={!!zoomedProduct} onClose={closeZoom} size="xl" isCentered>
        <ModalOverlay backdropFilter="blur(8px)" bg="rgba(0, 0, 0, 0.7)" />
        <ModalContent
          bg={cardBg}
          borderRadius="2xl"
          overflow="hidden"
          border="1px solid"
          borderColor={cardBorder}
        >
          <ModalHeader pb={2}>
            <HStack spacing={2} align="center">
              <Text fontWeight="800" fontSize="lg" color={headingColor}>
                {zoomedProduct?.caption || 'Product Preview'}
              </Text>
              {zoomedProduct?.categoryTitle && (
                <Badge colorScheme="teal" fontSize="xs">
                  {zoomedProduct.categoryTitle}
                </Badge>
              )}
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6} textAlign="center">
            {zoomedProduct && (
              <Box borderRadius="xl" overflow="hidden" maxH="65vh" display="flex" justifyContent="center">
                <Image
                  src={zoomedProduct.src}
                  alt={zoomedProduct.caption}
                  maxH="65vh"
                  objectFit="contain"
                  borderRadius="lg"
                />
              </Box>
            )}
            {zoomedProduct?.description && (
              <Text mt={4} color={textColor} fontSize="sm">
                {zoomedProduct.description}
              </Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Products;