import { useMemo, useState } from 'react';
import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import { FiX } from 'react-icons/fi';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useChatMessageScroll } from '../../hooks/useChatMessageScroll';
import { useChatPanelColors } from '../../hooks/useChatPanelColors';
import type { ChatMessage } from '../../types/chatAgent';
import { ChatComposer } from './ChatComposer';
import { ChatMessageList } from './ChatMessageList';

type ChatPanelProps = {
  zIndex: number;
  bottomOffset: number;
  examplesKey: string;
  sessionId: string | null;
  messages: ChatMessage[];
  isResumingSession: boolean;
  isLoadingMessages: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isSending: boolean;
  errorMsg: string | null;
  onSend: (text: string) => boolean;
  onClose: () => void;
};

export function ChatPanel({
  zIndex,
  bottomOffset,
  examplesKey,
  sessionId,
  messages,
  isResumingSession,
  isLoadingMessages,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  isSending,
  errorMsg,
  onSend,
  onClose,
}: ChatPanelProps) {
  const { t } = useThemedTranslation();
  const colors = useChatPanelColors();
  const [input, setInput] = useState('');

  const contextLabel = t(`chatAssistant.contexts.${examplesKey}`);
  const examples = useMemo(() => {
    const value = t(`chatAssistant.examples.${examplesKey}`, {
      returnObjects: true,
    });
    return Array.isArray(value) ? (value as string[]) : [];
  }, [examplesKey, t]);

  const { listRef, topSentinelRef, handleListScroll, stickToBottom } =
    useChatMessageScroll({
      open: true,
      sessionKey: sessionId,
      messages,
      isFetchingNextPage,
      hasNextPage,
      fetchNextPage,
      isSending,
    });

  const showEmptyState =
    messages.length === 0 &&
    !isSending &&
    !isResumingSession &&
    !isLoadingMessages;

  const handleSend = (text?: string) => {
    const message = (text ?? input).trim();
    if (!message) return;
    stickToBottom();
    if (onSend(message)) {
      setInput('');
    }
  };

  return (
    <Flex
      pointerEvents="auto"
      position="absolute"
      zIndex={zIndex}
      left={2}
      right={2}
      top="30%"
      bottom={`${bottomOffset}px`}
      direction="column"
      bg={colors.panelBg}
      color={colors.bodyColor}
      borderWidth="2px"
      borderColor={colors.headerBg}
      borderRadius="lg"
      boxShadow="lg"
      overflow="hidden"
    >
      <Flex
        align="center"
        justify="space-between"
        px={3}
        py={2}
        bg={colors.panelSurface}
        borderBottomWidth="1px"
        borderColor={colors.borderColor}
      >
        <Box>
          <Text fontWeight="bold" fontSize="md" color={colors.titleColor}>
            {t('chatAssistant.title')}
          </Text>
          <Text fontSize="xs" color={colors.muted}>
            {t('chatAssistant.subtitle')}
          </Text>
          <Text fontSize="xs" color={colors.muted}>
            {t('chatAssistant.contextLabel', { context: contextLabel })}
          </Text>
        </Box>
        <IconButton
          aria-label={t('chatAssistant.closeAria')}
          icon={<FiX />}
          size="sm"
          variant="ghost"
          color={colors.titleColor}
          onClick={onClose}
        />
      </Flex>

      <ChatMessageList
        listRef={listRef}
        topSentinelRef={topSentinelRef}
        onScroll={handleListScroll}
        messages={messages}
        showEmptyState={showEmptyState}
        isResumingOrLoading={isResumingSession || isLoadingMessages}
        isFetchingNextPage={isFetchingNextPage}
        isSending={isSending}
        errorMsg={errorMsg}
        panelBg={colors.panelBg}
        titleColor={colors.titleColor}
        bodyColor={colors.bodyColor}
        muted={colors.muted}
        errorColor={colors.errorColor}
        userBubble={colors.userBubble}
        primaryText={colors.primaryText}
        assistantBubble={colors.assistantBubble}
      />

      <ChatComposer
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
        isSending={isSending}
        showExamples={showEmptyState}
        examples={examples}
        panelBg={colors.panelBg}
        panelSurface={colors.panelSurface}
        borderColor={colors.borderColor}
        bodyColor={colors.bodyColor}
        muted={colors.muted}
        inputBg={colors.inputBg}
        primaryBg={colors.primaryBg}
        primaryText={colors.primaryText}
      />
    </Flex>
  );
}
