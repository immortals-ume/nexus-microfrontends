import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

export default defineConfig({
    plugins: [
        react(),
        federation({
            name: 'host',
            filename: 'remoteEntry.js',

            exposes: {
                './store': './src/store/index.ts',
                './services': './src/services/index.ts',
                './types': './src/services/types.ts',
                './eventBus': './src/utils/eventBus.ts',
            },

            remotes: {
                auth: {
                    type: "module",
                    name: "auth",
                    entry: "http://localhost:5178/remoteEntry.js",
                },
                product: {
                    type: "module",
                    name: "product",
                    entry: "http://localhost:5173/remoteEntry.js",
                },
                cart: {
                    type: "module",
                    name: "cart",
                    entry: "http://localhost:5174/remoteEntry.js",
                },
                checkout: {
                    type: "module",
                    name: "checkout",
                    entry: "http://localhost:5175/remoteEntry.js",
                },
                order: {
                    type: "module",
                    name: "order",
                    entry: "http://localhost:5176/remoteEntry.js",
                },
                customer: {
                    type: "module",
                    name: "customer",
                    entry: "http://localhost:5177/remoteEntry.js",
                },
                dashboard: {
                    type: "module",
                    name: "dashboard",
                    entry: "http://localhost:5180/remoteEntry.js",
                },
                admin: {
                    type: "module",
                    name: "admin",
                    entry: "http://localhost:5179/remoteEntry.js",
                },
                analytics: {
                    type: "module",
                    name: "analytics",
                    entry: "http://localhost:5181/remoteEntry.js",
                },
            },
            shared: [
                'react',
                'react-dom',
                'react-router-dom',
                'zustand',
                '@tanstack/react-query',
                'axios'
            ]
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
