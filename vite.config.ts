import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['super-family-quest.png'],
      manifest: {
        name: 'Super Family Quest',
        short_name: 'Family Quest',
        description: 'Gestão financeira familiar gamificada',
        theme_color: '#1a3478',
        background_color: '#1a3478',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,gif,woff2}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React e tudo que o consome em nível de módulo ficam juntos
          // para garantir ordem de inicialização correta.
          // Recharts/D3 usam React.forwardRef no top-level — separar React
          // num chunk diferente causa "Cannot read properties of undefined".
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/react-hook-form') ||
            id.includes('node_modules/@hookform') ||
            id.includes('node_modules/recharts') ||
            id.includes('node_modules/d3') ||
            id.includes('node_modules/@chakra-ui') ||
            id.includes('node_modules/@emotion') ||
            id.includes('node_modules/framer-motion') ||
            id.includes('node_modules/react-i18next')
          ) {
            return 'vendor-react';
          }

          // Dados / rede (sem dependência direta de React no top-level)
          if (
            id.includes('node_modules/@tanstack') ||
            id.includes('node_modules/axios') ||
            id.includes('node_modules/socket.io-client') ||
            id.includes('node_modules/engine.io-client')
          ) {
            return 'vendor-data';
          }

          // i18n core (sem React no top-level)
          if (id.includes('node_modules/i18next/')) {
            return 'vendor-i18n';
          }

          // Ícones — grande e sem inicialização React top-level problemática
          if (id.includes('node_modules/react-icons')) {
            return 'vendor-icons';
          }

          // Utilitários pesados sem dependência React top-level (QR, compressão, validação)
          if (
            id.includes('node_modules/@zxing') ||
            id.includes('node_modules/browser-image-compression') ||
            id.includes('node_modules/yup')
          ) {
            return 'vendor-utils';
          }

          // Não definir chunk para o restante — Rollup analisa o grafo de
          // dependências e agrupa automaticamente sem problemas de ordem.
        },
      },
    },
  },
})
