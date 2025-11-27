import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

/**
 * Vite Configuration for Product Microfrontend
 * 
 * Module Federation Setup:
 * - Exposes product-related components to the host application
 * - Shares core dependencies as singletons
 * - Runs on port 5173
 */
export default defineConfig({
  plugins: [
    react(),

    federation({
        name: "product",
        filename: "remoteEntry.js",
        exposes: {
            "./App": "./src/App.tsx",
            "./ProductGrid": "./src/components/ProductGrid.tsx",
            "./ProductCard": "./src/components/ProductCard.tsx",
            "./ProductDetail": "./src/pages/ProductDetail.tsx",
            "./SearchBar": "./src/components/SearchBar.tsx",
            "./FilterSidebar": "./src/components/FilterSidebar.tsx",
        },
        remotes: {
            host: {
                type: "module",
                name: "host",
                entry: "http://localhost:5172/remoteEntry.js",
            },
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
          requiredVersion: '^7.9.6',
        },
        zustand: {
          singleton: true,
          requiredVersion: '^5.0.8',
        },
        '@tanstack/react-query': {
          singleton: true,
          requiredVersion: '^5.90.10',
        },
        axios: {
          singleton: true,
          requiredVersion: '^1.13.2',
        },
      },
    }),
  ],
  server: {
    port: 5173,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})
