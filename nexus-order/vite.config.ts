import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'order',
      filename: 'remoteEntry.js',
      exposes: {
        './OrderHistory': './src/components/OrderHistory',
        './OrderDetail': './src/pages/OrderDetail',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^19.0.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.0.0',
        },
        zustand: {
          singleton: true,
        },
        '@tanstack/react-query': {
          singleton: true,
        },
        axios: {
          singleton: true,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5176,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 5176,
    strictPort: true,
    cors: true,
  },
});
