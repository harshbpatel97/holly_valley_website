import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Input,
  Button,
  VStack,
  HStack,
  Badge,
  Tooltip,
  useColorModeValue,
  Avatar,
  Collapse,
  Link as ChakraLink,
  Spinner,
  Wrap,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { getStoreStatus } from '../../utils/storeHours';
import { STORE_INFO, getLocalResponse } from './chatKnowledge';
import ChatQuickActions from './ChatQuickActions';
import './ChatBot.css';

// SVG Icons for self-contained, clean UI without extra deps
const ChatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const INITIAL_MESSAGE = {
  id: 'init-1',
  sender: 'assistant',
  text: `Hello! 👋 Welcome to Holly Valley. How can I help you today?\n\nYou can ask about our **store hours**, **U-Haul rentals**, **NC Lottery**, **EBT / payments**, or **directions**!`,
  actions: [
    { label: '🕒 Store Hours', prompt: 'Are you open right now?' },
    { label: '🚚 Rent a U-Haul', prompt: 'How do I rent a U-Haul truck or trailer?' },
    { label: '💳 EBT & Payments', prompt: 'Do you take EBT / SNAP and contactless payments?' },
  ],
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

// Formats markdown: bold, italic, bullet points, line breaks
const renderFormattedText = (text) => {
  if (!text) return null;
  const lines = text.split('\n');

  return lines.map((line, lineIndex) => {
    // Process bold (**text**) and italic (*text*)
    const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    const formattedLine = parts.map((part, partIndex) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={partIndex}>{part.slice(1, -1)}</em>;
      }
      return part;
    });

    return (
      <Text key={lineIndex} mb={line.trim() === '' ? 2 : 1} fontSize="sm" lineHeight="tall">
        {formattedLine}
      </Text>
    );
  });
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('holly_chat_messages');
      return saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
    } catch {
      return [INITIAL_MESSAGE];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [storeStatus, setStoreStatus] = useState(getStoreStatus());
  const messagesEndRef = useRef(null);

  // Update store status every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setStoreStatus(getStoreStatus());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Save messages to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('holly_chat_messages', JSON.stringify(messages));
    } catch (e) {
      // Ignore session storage quota errors
    }
  }, [messages]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Theme color tokens
  const cardBg = useColorModeValue('white', '#131C2E');
  const cardBorder = useColorModeValue('gray.200', '#27354F');
  const headerBg = useColorModeValue('brand.500', '#0F766E');
  const bodyBg = useColorModeValue('gray.50', '#0B0F17');
  const assistantBubbleBg = useColorModeValue('white', '#1E293B');
  const assistantBubbleBorder = useColorModeValue('gray.200', '#334155');
  const assistantTextColor = useColorModeValue('gray.800', 'gray.100');
  const userBubbleBg = useColorModeValue('brand.500', 'brand.600');
  const userTextColor = 'white';
  const inputBg = useColorModeValue('white', '#131C2E');
  const inputBorder = useColorModeValue('gray.300', '#27354F');
  const fabBg = useColorModeValue('brand.500', 'brand.500');

  const handleSendMessage = async (queryText) => {
    const textToSend = (queryText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    // 1. First check instant local knowledge base ($0 cost, 0ms latency)
    const localMatch = getLocalResponse(textToSend);

    if (localMatch) {
      // Simulate quick natural pause for realistic UI feel
      setTimeout(() => {
        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: localMatch.text,
          actions: localMatch.actions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsLoading(false);
      }, 350);
      return;
    }

    // 2. If a backend API is configured via environment variables, try calling it
    const chatApiUrl = process.env.REACT_APP_CHAT_API_URL;
    if (chatApiUrl) {
      try {
        const response = await fetch(chatApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: textToSend,
            storeStatus: storeStatus.statusText,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const botMsg = {
            id: `bot-${Date.now()}`,
            sender: 'assistant',
            text: data.reply || "I'm happy to help with any questions about Holly Valley Grocery & Services!",
            actions: data.actions || [],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, botMsg]);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        // Fallback to local assistant logic if backend fails
      }
    }

    // 3. Graceful Smart Fallback (100% $0 cost)
    setTimeout(() => {
      const fallbackMsg = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Thanks for reaching out! Holly Valley is located at **${STORE_INFO.address}**.\n\nFor specific inventory items or immediate assistance, our team is happy to help over the phone during regular store hours (**${storeStatus.todaySchedule}** today).`,
        actions: [
          { label: '📞 Call Store', url: `tel:${STORE_INFO.phoneClean}`, isExternal: true },
          { label: '📍 Get Directions', url: STORE_INFO.googleMapsUrl, isExternal: true },
          { label: '🚚 U-Haul Rentals', url: STORE_INFO.uhaulUrl, isExternal: true },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setIsLoading(false);
    }, 450);
  };

  const handleClearHistory = () => {
    setMessages([INITIAL_MESSAGE]);
    try {
      sessionStorage.removeItem('holly_chat_messages');
    } catch {
      // Ignore
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box position="fixed" bottom={{ base: '20px', md: '28px' }} right={{ base: '16px', md: '28px' }} zIndex={1000}>
      {/* Floating Action Button */}
      <Tooltip label={isOpen ? 'Close Assistant' : 'Ask Holly AI'} placement="left" hasArrow>
        <Box position="relative">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            bg={fabBg}
            color="white"
            borderRadius="full"
            w={{ base: '54px', md: '60px' }}
            h={{ base: '54px', md: '60px' }}
            p={0}
            boxShadow="0 8px 24px rgba(13, 148, 136, 0.4)"
            _hover={{
              bg: 'brand.600',
              transform: 'scale(1.06)',
              boxShadow: '0 12px 28px rgba(13, 148, 136, 0.5)',
            }}
            _active={{
              transform: 'scale(0.95)',
            }}
            transition="all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            aria-label="Open Store Assistant"
          >
            {isOpen ? <CloseIcon /> : <ChatIcon />}
          </Button>

          {/* Unread / Status Badge */}
          {!isOpen && (
            <Badge
              position="absolute"
              top="-2px"
              right="-2px"
              bg={storeStatus.isOpen ? 'green.400' : 'amber.500'}
              color="white"
              borderRadius="full"
              w="14px"
              h="14px"
              p={0}
              border="2px solid white"
            />
          )}
        </Box>
      </Tooltip>

      {/* Chat Window Panel */}
      <Collapse in={isOpen} animateOpacity>
        <Box
          position="fixed"
          bottom={{ base: '84px', md: '98px' }}
          right={{ base: '12px', md: '28px' }}
          w={{ base: 'calc(100vw - 24px)', sm: '380px', md: '410px' }}
          maxW="430px"
          h={{ base: '520px', md: '560px' }}
          maxH="calc(100vh - 120px)"
          bg={cardBg}
          border="1px solid"
          borderColor={cardBorder}
          borderRadius="2xl"
          boxShadow="0 20px 40px -10px rgba(0,0,0,0.3), 0 0 15px rgba(13, 148, 136, 0.15)"
          display="flex"
          flexDirection="column"
          overflow="hidden"
          zIndex={1001}
        >
          {/* Header */}
          <Flex
            bg={headerBg}
            color="white"
            px={4}
            py={3}
            align="center"
            justify="space-between"
            borderTopRadius="2xl"
          >
            <HStack spacing={3}>
              <Avatar
                size="sm"
                name="Holly Valley"
                bg="white"
                color="brand.600"
                fontWeight="bold"
                icon={<Text fontSize="sm">🏪</Text>}
              />
              <Box>
                <HStack spacing={2} align="center">
                  <Text fontWeight="bold" fontSize="sm" lineHeight="shorter">
                    Holly Assistant
                  </Text>
                  <Badge
                    bg={storeStatus.isOpen ? 'green.400' : 'gray.400'}
                    color="white"
                    fontSize="2xs"
                    px={1.5}
                    py={0.5}
                    borderRadius="full"
                  >
                    {storeStatus.isOpen ? 'Open Now' : 'Closed'}
                  </Badge>
                </HStack>
                <Text fontSize="2xs" opacity={0.9}>
                  Holly Valley Store & U-Haul Guide
                </Text>
              </Box>
            </HStack>

            <HStack spacing={1}>
              <Tooltip label="Clear Chat History" placement="top" hasArrow>
                <IconButton
                  size="xs"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  icon={<TrashIcon />}
                  aria-label="Clear chat history"
                  onClick={handleClearHistory}
                />
              </Tooltip>
              <IconButton
                size="xs"
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                icon={<CloseIcon />}
                aria-label="Close chat"
                onClick={() => setIsOpen(false)}
              />
            </HStack>
          </Flex>

          {/* Message List */}
          <Box
            flex="1"
            p={3.5}
            overflowY="auto"
            bg={bodyBg}
            className="chat-message-container"
          >
            <VStack spacing={3} align="stretch">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <Box key={msg.id} alignSelf={isUser ? 'flex-end' : 'flex-start'} maxW="88%">
                    <Box
                      bg={isUser ? userBubbleBg : assistantBubbleBg}
                      color={isUser ? userTextColor : assistantTextColor}
                      border={isUser ? 'none' : '1px solid'}
                      borderColor={isUser ? 'transparent' : assistantBubbleBorder}
                      px={3.5}
                      py={2.5}
                      borderRadius="xl"
                      borderTopRightRadius={isUser ? 'xs' : 'xl'}
                      borderTopLeftRadius={isUser ? 'xl' : 'xs'}
                      boxShadow="sm"
                    >
                      {renderFormattedText(msg.text)}

                      {/* Action buttons embedded in message */}
                      {msg.actions && msg.actions.length > 0 && (
                        <Wrap spacing={1.5} mt={2.5}>
                          {msg.actions.map((act, actIdx) => {
                            if (act.prompt) {
                              return (
                                <Button
                                  key={actIdx}
                                  size="xs"
                                  colorScheme="brand"
                                  variant="outline"
                                  borderRadius="full"
                                  fontSize="xs"
                                  onClick={() => handleSendMessage(act.prompt)}
                                >
                                  {act.label}
                                </Button>
                              );
                            }
                            if (act.isExternal) {
                              return (
                                <Button
                                  as={ChakraLink}
                                  href={act.url}
                                  target={act.url.startsWith('tel:') ? '_self' : '_blank'}
                                  rel="noopener noreferrer"
                                  key={actIdx}
                                  size="xs"
                                  colorScheme="brand"
                                  variant="solid"
                                  borderRadius="full"
                                  fontSize="xs"
                                  _hover={{ textDecoration: 'none' }}
                                >
                                  {act.label}
                                </Button>
                              );
                            }
                            return (
                              <Button
                                as={RouterLink}
                                to={act.url}
                                key={actIdx}
                                size="xs"
                                colorScheme="brand"
                                variant="solid"
                                borderRadius="full"
                                fontSize="xs"
                                onClick={() => setIsOpen(false)}
                              >
                                {act.label}
                              </Button>
                            );
                          })}
                        </Wrap>
                      )}
                    </Box>

                    <Text
                      fontSize="2xs"
                      color="gray.400"
                      mt={1}
                      textAlign={isUser ? 'right' : 'left'}
                      px={1}
                    >
                      {msg.timestamp}
                    </Text>
                  </Box>
                );
              })}

              {/* Typing / Loading indicator */}
              {isLoading && (
                <Box alignSelf="flex-start" maxW="80%">
                  <HStack
                    bg={assistantBubbleBg}
                    border="1px solid"
                    borderColor={assistantBubbleBorder}
                    px={3.5}
                    py={2.5}
                    borderRadius="xl"
                    borderTopLeftRadius="xs"
                    spacing={2}
                  >
                    <Spinner size="xs" color="brand.500" />
                    <Text fontSize="xs" color="gray.500">
                      Checking store knowledge...
                    </Text>
                  </HStack>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </VStack>
          </Box>

          {/* Quick Action Suggestions */}
          <Box borderTop="1px solid" borderColor={cardBorder} bg={cardBg}>
            <ChatQuickActions onSelectAction={handleSendMessage} disabled={isLoading} />
          </Box>

          {/* Footer Input */}
          <Box p={3} borderTop="1px solid" borderColor={cardBorder} bg={cardBg}>
            <HStack spacing={2}>
              <Input
                placeholder="Ask about hours, U-Haul, lottery, EBT..."
                size="sm"
                borderRadius="xl"
                bg={inputBg}
                borderColor={inputBorder}
                _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #0D9488' }}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                isDisabled={isLoading}
              />
              <IconButton
                size="sm"
                colorScheme="brand"
                borderRadius="xl"
                icon={<SendIcon />}
                aria-label="Send message"
                onClick={() => handleSendMessage()}
                isDisabled={!inputMessage.trim() || isLoading}
              />
            </HStack>
            <Flex justify="space-between" align="center" mt={1.5} px={1}>
              <Text fontSize="2xs" color="gray.400">
                100% Free Store Guide
              </Text>
              <ChakraLink
                href={`tel:${STORE_INFO.phoneClean}`}
                fontSize="2xs"
                color="brand.500"
                fontWeight="bold"
              >
                Call: {STORE_INFO.phone}
              </ChakraLink>
            </Flex>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default ChatWidget;
