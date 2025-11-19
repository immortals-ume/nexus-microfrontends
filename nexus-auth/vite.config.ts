import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'auth',
      filename: 'remoteEntry.js',
      exposes: {
        './LoginForm': './src/components/LoginForm',
        './RegisterForm': './src/components/RegisterForm',
        './ForgotPasswordForm': './src/components/ForgotPasswordForm',
        './AuthApp': './src/App',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^19.2.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.2.0',
        },
        'react-router-dom': {
          singleton: true,
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
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5178,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 5178,
    strictPort: true,
    cors: true,
  },
});
