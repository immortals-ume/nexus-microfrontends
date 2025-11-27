import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

export default defineConfig({
    plugins: [
        react(),
        federation({
            name: 'customer',
            filename: 'remoteEntry.js',
            exposes: {
                './App': './src/App.tsx',
                './ProfilePage': './src/components/ProfilePage.tsx',
                './AddressBook': './src/components/AddressBook.tsx',
                './PaymentMethods': './src/components/PaymentMethods.tsx',
            },
            shared: [
                'react',
                'react-dom',
                'react-router-dom',
                'zustand',
                '@tanstack/react-query',
                'axios',
            ],
        }),
    ],
    server: {
        port: 5177,
        strictPort: true,
        cors: true,
    },
    preview: {
        port: 5177,
        strictPort: true,
        cors: true,
    },
    build: {
        modulePreload: false,
        target: 'esnext',
        minify: false,
        cssCodeSplit: false,
    },
})
