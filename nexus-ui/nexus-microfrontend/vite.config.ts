import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

/**
 * Vite Configuration for Host Application
 * 
 * Module Federation Setup:
 * - Host application that loads remote microfrontends
 * - Shares core dependencies as singletons to prevent duplication
 * - Remotes: dashboard (5173), admin (5174), analytics (5175)
 * - Host runs on port 5172
 */
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host',
      filename: 'remoteEntry.js',
      // Expose shared services and utilities to remotes
      exposes: {
        './store': './src/store/index.ts',
        './services': './src/services/index.ts',
        './types': './src/services/types.ts',
        './eventBus': './src/utils/eventBus.ts',
      },
      remotes: {
        auth: "http://localhost:5178/assets/remoteEntry.js",
        product: "http://localhost:5173/assets/remoteEntry.js",
        dashboard: "http://localhost:5176/assets/remoteEntry.js",
        admin: "http://localhost:5174/assets/remoteEntry.js",
        analytics: "http://localhost:5175/assets/remoteEntry.js"
      },
      // Shared dependencies - treated as singletons to prevent duplication
      // All remotes will use the same instance of these libraries
      shared: {
        react: "^19.2.0",
        "react-dom": "^19.2.0",
        "react-router-dom": "^7.9.6",
        zustand: "^5.0.8",
        "@tanstack/react-query": "^5.90.10",
        axios: "^1.13.2",
      },

    }),
  ],
  server: {
    port: 5172,
    strictPort: true,
  },
  preview: {
    port: 5172,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})
