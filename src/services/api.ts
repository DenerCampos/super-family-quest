import axios from 'axios';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';
import { handleUnauthorizedResponse } from './authSession';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Header fixo para todas as requisições
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros específicos do ngrok e sessão expirada (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleUnauthorizedResponse(error.config?.url);
    }

    if (error.code === 'ERR_NGROK_6024') {
      console.error('Erro do ngrok detectado:', error);
    }
    return Promise.reject(error);
  },
);

export default api;
