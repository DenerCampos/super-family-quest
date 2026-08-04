import api from './api';
import type {
  ChatSession,
  PaginatedChatMessages,
  SendChatMessageResponse,
} from '../types/chatAgent';

const MESSAGES_PAGE_SIZE = 20;

export const ChatAgentService = {
  async createSession(title?: string): Promise<ChatSession> {
    const { data } = await api.post<ChatSession>('/chat-agent/sessions', {
      title,
    });
    return data;
  },

  async listSessions(): Promise<ChatSession[]> {
    const { data } = await api.get<ChatSession[]>('/chat-agent/sessions');
    return data;
  },

  async getMessages(
    sessionId: string,
    page = 1,
    limit = MESSAGES_PAGE_SIZE,
  ): Promise<PaginatedChatMessages> {
    const { data } = await api.get<PaginatedChatMessages>(
      `/chat-agent/sessions/${sessionId}/messages`,
      { params: { page, limit } },
    );
    return data;
  },

  async sendMessage(
    sessionId: string,
    message: string,
    screenContext?: string,
  ): Promise<SendChatMessageResponse> {
    const { data } = await api.post<SendChatMessageResponse>(
      `/chat-agent/sessions/${sessionId}/messages`,
      { message, screenContext },
    );
    return data;
  },

  async deleteSession(sessionId: string): Promise<void> {
    await api.delete(`/chat-agent/sessions/${sessionId}`);
  },
};

export { MESSAGES_PAGE_SIZE };
