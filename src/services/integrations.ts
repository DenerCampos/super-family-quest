import api from './api';

export type AlexaIntegration = {
  connected: boolean;
  linkedAt?: string;
};

export type IntegrationsStatus = {
  alexa: AlexaIntegration;
  google_assistant?: {
    connected: boolean;
  };
};

export const IntegrationsService = {
  getStatus: async (): Promise<IntegrationsStatus> => {
    const response = await api.get('/profile/integrations');
    return response.data;
  },

  alexaOAuthLogin: async (
    email: string,
    password: string,
    sessionCode: string,
  ): Promise<{ redirectUrl: string }> => {
    const response = await api.post('/auth/oauth/login', {
      email,
      password,
      session_code: sessionCode,
    });
    return response.data;
  },

  unlinkAlexa: async (): Promise<void> => {
    await api.post('/profile/integrations/alexa/unlink');
  },
};
