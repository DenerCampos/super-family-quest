import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { useThemedTranslation } from './useThemedTranslation';
import {
  ChatAgentService,
  MESSAGES_PAGE_SIZE,
} from '../services/chatAgent';
import { chatAgentQueryKeys } from './chatAgentQueryKeys';
import type { ChatMessage, PaginatedChatMessages } from '../types/chatAgent';

function mapSendError(err: unknown, t: (key: string) => string): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const code = (err.response?.data as { error?: string } | undefined)?.error;
    if (status === 429 || code === 'API Quota Exceeded') {
      return t('chatAssistant.errorQuota');
    }
    if (status === 502 || code === 'CHAT_AI_PROVIDER_ERROR') {
      return t('chatAssistant.errorProvider');
    }
  }
  return t('chatAssistant.errorNetwork');
}

function buildOptimisticUserMessage(
  content: string,
  sessionId: string | null,
  screenContext: string,
): ChatMessage {
  return {
    id: `optimistic-${Date.now()}`,
    sessionId: sessionId ?? 'pending',
    role: 'user',
    content,
    screenContext,
    toolTrace: null,
    createdAt: new Date().toISOString(),
  };
}

/** Evita keys duplicadas quando páginas do infinite query se sobrepõem. */
function dedupeMessagesById(messages: ChatMessage[]): ChatMessage[] {
  const seen = new Set<string>();
  const result: ChatMessage[] = [];
  for (const message of messages) {
    if (seen.has(message.id)) continue;
    seen.add(message.id);
    result.push(message);
  }
  return result;
}

type UseChatAgentOptions = {
  open: boolean;
  screenContext: string;
};

export function useChatAgent({ open, screenContext }: UseChatAgentOptions) {
  const { t } = useThemedTranslation();
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [optimisticMessage, setOptimisticMessage] =
    useState<ChatMessage | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const lastSendSessionIdRef = useRef<string | null>(null);

  const sessionsQuery = useQuery({
    queryKey: chatAgentQueryKeys.sessions(),
    queryFn: () => ChatAgentService.listSessions(),
    enabled: open,
  });

  /** Retoma a sessão mais recente (API: updatedAt DESC). */
  useEffect(() => {
    if (!open || sessionId || !sessionsQuery.data?.[0]) return;
    setSessionId(sessionsQuery.data[0].id);
  }, [open, sessionId, sessionsQuery.data]);

  const messagesQuery = useInfiniteQuery<PaginatedChatMessages>({
    queryKey: chatAgentQueryKeys.messages(sessionId ?? 'none'),
    queryFn: ({ pageParam }) =>
      ChatAgentService.getMessages(
        sessionId as string,
        pageParam as number,
        MESSAGES_PAGE_SIZE,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    enabled: !!sessionId && open,
  });

  const remoteMessages = useMemo(() => {
    const pages = messagesQuery.data?.pages ?? [];
    // page 1 = recentes; pages seguintes = mais antigas → inverter para cronológico
    const flat = [...pages].reverse().flatMap((page) => page.data);
    return dedupeMessagesById(flat);
  }, [messagesQuery.data]);

  const messages = useMemo(() => {
    if (!optimisticMessage) return remoteMessages;
    const alreadyPersisted = remoteMessages.some(
      (m) =>
        m.role === 'user' &&
        m.content === optimisticMessage.content &&
        Math.abs(
          new Date(m.createdAt).getTime() -
            new Date(optimisticMessage.createdAt).getTime(),
        ) < 60_000,
    );
    if (alreadyPersisted) return remoteMessages;
    return [...remoteMessages, optimisticMessage];
  }, [remoteMessages, optimisticMessage]);

  const ensureSession = useCallback(async () => {
    if (sessionId) return sessionId;

    const sessions: Awaited<ReturnType<typeof ChatAgentService.listSessions>> =
      sessionsQuery.data ??
      (await queryClient.fetchQuery({
        queryKey: chatAgentQueryKeys.sessions(),
        queryFn: () => ChatAgentService.listSessions(),
      }));

    const latest = sessions[0];
    if (latest) {
      setSessionId(latest.id);
      return latest.id;
    }

    const session = await ChatAgentService.createSession();
    setSessionId(session.id);
    await queryClient.invalidateQueries({
      queryKey: chatAgentQueryKeys.sessions(),
    });
    return session.id;
  }, [sessionId, sessionsQuery.data, queryClient]);

  const refreshMessages = useCallback(
    async (id: string) => {
      // Descarta páginas antigas (offset muda quando entram msgs novas).
      await queryClient.resetQueries({
        queryKey: chatAgentQueryKeys.messages(id),
      });
    },
    [queryClient],
  );

  const sendMutation = useMutation({
    mutationFn: async (text: string) => {
      const id = await ensureSession();
      lastSendSessionIdRef.current = id;
      return ChatAgentService.sendMessage(id, text, screenContext);
    },
    onSuccess: async (data) => {
      setErrorMsg(null);
      await refreshMessages(data.userMessage.sessionId);
      setOptimisticMessage(null);
    },
    onError: async (err) => {
      setErrorMsg(mapSendError(err, t));
      const id = lastSendSessionIdRef.current ?? sessionId;
      if (id) {
        // 502: mensagem do usuário já está no banco; 429: só sincroniza.
        await refreshMessages(id);
      }
      setOptimisticMessage(null);
    },
  });

  const sendMessage = useCallback(
    (text: string) => {
      const message = text.trim();
      if (!message || sendMutation.isPending) return false;

      setErrorMsg(null);
      setOptimisticMessage(
        buildOptimisticUserMessage(message, sessionId, screenContext),
      );
      sendMutation.mutate(message);
      return true;
    },
    [sendMutation, sessionId, screenContext],
  );

  const isResumingSession =
    open && !sessionId && sessionsQuery.isFetching && !sessionsQuery.isError;

  return {
    sessionId,
    messages,
    isResumingSession,
    isLoadingMessages: messagesQuery.isLoading,
    isFetchingNextPage: messagesQuery.isFetchingNextPage,
    hasNextPage: messagesQuery.hasNextPage,
    fetchNextPage: messagesQuery.fetchNextPage,
    sendMessage,
    isSending: sendMutation.isPending,
    errorMsg,
    clearError: () => setErrorMsg(null),
  };
}
