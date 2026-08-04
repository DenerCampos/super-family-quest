export const chatAgentQueryKeys = {
  all: ['chat-agent'] as const,
  sessions: () => [...chatAgentQueryKeys.all, 'sessions'] as const,
  messages: (sessionId: string) =>
    [...chatAgentQueryKeys.all, 'messages', sessionId] as const,
};
