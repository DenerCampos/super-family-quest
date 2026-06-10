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
          // Gráficos — recharts é o maior contribuinte isolado
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3')) {
            return 'vendor-charts';
          }

          // UI / animações
          if (
            id.includes('node_modules/@chakra-ui') ||
            id.includes('node_modules/@emotion') ||
            id.includes('node_modules/framer-motion')
          ) {
            return 'vendor-ui';
          }

          // React core
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom') ||
            id.includes('node_modules/react-hook-form')
          ) {
            return 'vendor-react';
          }

          // Dados / rede
          if (
            id.includes('node_modules/@tanstack') ||
            id.includes('node_modules/axios') ||
            id.includes('node_modules/socket.io-client') ||
            id.includes('node_modules/engine.io-client')
          ) {
            return 'vendor-data';
          }

          // Ícones (react-icons costuma ser grande)
          if (id.includes('node_modules/react-icons')) {
            return 'vendor-icons';
          }

          // i18n
          if (
            id.includes('node_modules/i18next') ||
            id.includes('node_modules/react-i18next')
          ) {
            return 'vendor-i18n';
          }

          // Formulários / validação
          if (
            id.includes('node_modules/yup') ||
            id.includes('node_modules/@hookform')
          ) {
            return 'vendor-forms';
          }

          // Utilitários pesados (QR, compressão)
          if (
            id.includes('node_modules/@zxing') ||
            id.includes('node_modules/browser-image-compression')
          ) {
            return 'vendor-utils';
          }

          // Restante de node_modules
          if (id.includes('node_modules/')) {
            return 'vendor-misc';
          }
        },
      },
    },
  },
})
