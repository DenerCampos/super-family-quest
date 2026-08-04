import {
  Box,
  Flex,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import type { Ref } from 'react';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import type { ChatMessage } from '../../types/chatAgent';
import { HealthMarkdownContent } from '../health/HealthMarkdownContent';

type ChatMessageListProps = {
  listRef: Ref<HTMLDivElement>;
  topSentinelRef: Ref<HTMLDivElement>;
  onScroll: () => void;
  messages: ChatMessage[];
  showEmptyState: boolean;
  isResumingOrLoading: boolean;
  isFetchingNextPage: boolean;
  isSending: boolean;
  errorMsg: string | null;
  panelBg: string;
  titleColor: string;
  bodyColor: string;
  muted: string;
  errorColor: string;
  userBubble: string;
  primaryText: string;
  assistantBubble: string;
};

export function ChatMessageList({
  listRef,
  topSentinelRef,
  onScroll,
  messages,
  showEmptyState,
  isResumingOrLoading,
  isFetchingNextPage,
  isSending,
  errorMsg,
  panelBg,
  titleColor,
  bodyColor,
  muted,
  errorColor,
  userBubble,
  primaryText,
  assistantBubble,
}: ChatMessageListProps) {
  const { t } = useThemedTranslation();

  return (
    <VStack
      ref={listRef}
      align="stretch"
      spacing={2}
      px={3}
      py={2}
      flex="1"
      overflowY="auto"
      minH={0}
      bg={panelBg}
      onScroll={onScroll}
    >
      <Box ref={topSentinelRef} h="1px" w="100%" flexShrink={0} />
      {isFetchingNextPage && (
        <Flex justify="center" py={1}>
          <Spinner size="sm" color={titleColor} />
        </Flex>
      )}
      {showEmptyState && (
        <Text fontSize="sm" color={muted}>
          {t('chatAssistant.empty')}
        </Text>
      )}
      {isResumingOrLoading && messages.length === 0 && (
        <Flex align="center" gap={2} color={muted} fontSize="sm">
          <Spinner size="sm" color={titleColor} />
          <Text>{t('chatAssistant.thinking')}</Text>
        </Flex>
      )}
      {messages.map((m) => (
        <Box
          key={m.id}
          alignSelf={m.role === 'user' ? 'flex-end' : 'flex-start'}
          maxW="90%"
          px={3}
          py={2}
          borderRadius="md"
          bg={m.role === 'user' ? userBubble : assistantBubble}
          color={m.role === 'user' ? primaryText : bodyColor}
          fontSize="sm"
          whiteSpace={m.role === 'user' ? 'pre-wrap' : undefined}
          opacity={m.id.startsWith('optimistic-') ? 0.85 : 1}
        >
          {m.role === 'assistant' ? (
            <HealthMarkdownContent
              content={m.content}
              textPrimary={bodyColor}
            />
          ) : (
            m.content
          )}
        </Box>
      ))}
      {isSending && (
        <Flex align="center" gap={2} color={muted} fontSize="sm">
          <Spinner size="sm" color={titleColor} />
          <Text>{t('chatAssistant.thinking')}</Text>
        </Flex>
      )}
      {errorMsg && (
        <Text fontSize="sm" color={errorColor}>
          {errorMsg}
        </Text>
      )}
    </VStack>
  );
}
