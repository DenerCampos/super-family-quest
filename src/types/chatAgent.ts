export type ChatMessageRole = 'user' | 'assistant' | 'system';

export type ChatSession = {
  id: string;
  userId: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ChatMessage = {
  id: string;
  sessionId: string;
  role: ChatMessageRole;
  content: string;
  screenContext: string | null;
  toolTrace: Array<{ name: string; ok: boolean }> | null;
  createdAt: string;
};

export type SendChatMessageResponse = {
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
};

export type PaginatedChatMessages = {
  data: ChatMessage[];
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    previous: string | null;
    next: string | null;
    last: string;
  };
};
