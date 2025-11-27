import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

export default defineConfig({
    plugins: [
        react(),
        federation({
            name: 'auth',
            filename: 'remoteEntry.js',
            exposes: {
                './App': './src/App.tsx',
                './LoginForm': './src/components/LoginForm.tsx',
                './RegisterForm': './src/components/RegisterForm.tsx',
                './ForgotPasswordForm': './src/components/ForgotPasswordForm.tsx',
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
        port: 5178,
        strictPort: true,
        cors: true,
    },
    preview: {
        port: 5178,
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
