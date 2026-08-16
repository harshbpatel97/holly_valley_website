import React from 'react';
import { Box, HStack, Button, useColorModeValue } from '@chakra-ui/react';
import { QUICK_ACTIONS } from './chatKnowledge';

const ChatQuickActions = ({ onSelectAction, disabled }) => {
  const chipBg = useColorModeValue('gray.100', 'rgba(255, 255, 255, 0.08)');
  const chipHoverBg = useColorModeValue('brand.50', 'rgba(13, 148, 136, 0.2)');
  const chipBorder = useColorModeValue('gray.200', 'rgba(255, 255, 255, 0.12)');
  const chipColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box
      px={3}
      py={2}
      overflowX="auto"
      className="chat-quick-actions-scroll"
    >
      <HStack spacing={1.5} minW="max-content">
        {QUICK_ACTIONS.map((action) => (
          <Button
            key={action.id}
            size="xs"
            variant="outline"
            borderRadius="full"
            bg={chipBg}
            borderColor={chipBorder}
            color={chipColor}
            fontWeight="500"
            fontSize="xs"
            px={2.5}
            py={1}
            height="26px"
            flexShrink={0}
            _hover={{
              bg: chipHoverBg,
              borderColor: 'brand.400',
              color: 'brand.500',
              transform: 'translateY(-1px)',
            }}
            _active={{
              transform: 'translateY(0)',
            }}
            onClick={() => onSelectAction(action.prompt, true)}
            isDisabled={disabled}
          >
            {action.label}
          </Button>
        ))}
      </HStack>
    </Box>
  );
};

export default ChatQuickActions;
