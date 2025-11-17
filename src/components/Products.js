import React, { useState, useEffect } from 'react';
import { getAllProductCategories, refreshProductImages } from '../config/productImages';
import { Box, Heading, Text, Collapse, SimpleGrid, useColorModeValue, Image } from '@chakra-ui/react';
import ProductCard from './ProductCard';
import { track } from '../utils/ga';

const Products = () => {
  const [activeAccordion, setActiveAccordion] = useState('groceries');
  const [zoomedImage, setZoomedImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Always call hooks at the top level
  const sectionTextColor = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardHoverBg = useColorModeValue('teal.100', 'teal.700');
  const cardBorder = useColorModeValue('gray.100', 'gray.700');
  const panelTextColor = useColorModeValue('gray.700', 'gray.200');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        await refreshProductImages();
        const updatedProducts = getAllProductCategories();
        setProducts(updatedProducts);
      } catch (error) {
        setProducts(getAllProductCategories());
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
    track('product_category_open', { category: id });
  };

  const handleImageClick = (imageSrc, category, caption) => {
    setZoomedImage(imageSrc);
    track('product_image_zoom', { category, item_caption: caption });
  };

  const closeZoom = () => {
    setZoomedImage(null);
  };

  useEffect(() => {
    if (zoomedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [zoomedImage]);

  if (loading) {
    return (
      <Box p={8}><Text>Loading products...</Text></Box>
    );
  }

  return (
    <Box p={{ base: 2, md: 8 }}>
      <Box mb={8} textAlign="center">
        <Heading mb={2}>PRODUCTS</Heading>
        <Text color={sectionTextColor}>
          Holly Valley offers a variety of products ranging from groceries to soft-drinks. A detailed overview of each department is mentioned along with the brands and options available in each category.
        </Text>
      </Box>
      {products.map((product) => (
        <Box key={product.id} mb={6} borderWidth="1px" borderRadius="lg" boxShadow="md" bg={cardBg}
          _hover={{ boxShadow: 'lg' }}>
          <Box
            as="button"
            w="100%"
            textAlign="left"
            px={6}
            py={4}
            fontWeight="bold"
            fontSize="xl"
            borderTopRadius="lg"
            bg={activeAccordion === product.id ? cardHoverBg : cardBorder}
            onClick={() => toggleAccordion(product.id)}
          >
            {product.title}
          </Box>
          <Collapse in={activeAccordion === product.id} animateOpacity>
            <Box px={6} py={4}>
              <Text mb={4} color={panelTextColor}>{product.description}</Text>
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
                {product.items.map((item) => (
                  <ProductCard
                    key={item.id}
                    image={item.src}
                    name={item.caption}
                    category={product.title}
                    onClick={() => handleImageClick(item.src, product.id, item.caption)}
                  />
                ))}
              </SimpleGrid>
            </Box>
          </Collapse>
        </Box>
      ))}
      {zoomedImage && (
        <Box
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          bg="rgba(0,0,0,0.7)"
          zIndex={1000}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={closeZoom}
        >
          <Box bg="white" p={4} borderRadius="md" boxShadow="lg" maxW="90vw" maxH="90vh" position="relative">
            <Image src={zoomedImage} alt="Zoomed" maxH="70vh" maxW="80vw" />
            <Box
              as="button"
              position="absolute"
              top={2}
              right={2}
              fontSize="2xl"
              color="gray.600"
              bg="transparent"
              border="none"
              cursor="pointer"
              onClick={closeZoom}
            >
              &times;
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Products; 