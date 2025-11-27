import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { AxiosError } from 'axios'
import { handleApiError, isAuthError } from '../utils/errorHandler'

/**
 * Centralized Axios Interceptor Setup
 * 
 * Provides consistent request/response handling across all service clients.
 * Handles authentication, error handling, and logging.
 */

/**
 * Setup request interceptor for authentication
 */
export const setupRequestInterceptor = (client: AxiosInstance) => {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get token from localStorage (persisted by Zustand)
      const storedState = localStorage.getItem('nexus-ecommerce-store')
      
      if (storedState) {
        try {
          const state = JSON.parse(storedState)
          const token = state?.state?.auth?.token
          
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
          }
        } catch (error) {
          console.error('Failed to parse stored state:', error)
        }
      }
      
      // Add request timestamp for performance monitoring
      config.metadata = { startTime: Date.now() }
      
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}

/**
 * Setup response interceptor for error handling
 */
export const setupResponseInterceptor = (client: AxiosInstance, serviceName: string) => {
  client.interceptors.response.use(
    (response) => {
      // Log response time for performance monitoring
      const startTime = response.config.metadata?.startTime
      if (startTime) {
        const duration = Date.now() - startTime
        if (duration > 3000) {
          console.warn(`Slow ${serviceName} request: ${response.config.url} took ${duration}ms`)
        }
      }
      
      return response
    },
    async (error: AxiosError) => {
      // Handle authentication errors
      if (isAuthError(error)) {
        // Clear auth state
        try {
          const storedState = localStorage.getItem('nexus-ecommerce-store')
          if (storedState) {
            const state = JSON.parse(storedState)
            if (state?.state?.auth) {
              state.state.auth = {
                user: null,
                token: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
              }
              localStorage.setItem('nexus-ecommerce-store', JSON.stringify(state))
            }
          }
        } catch (e) {
          console.error('Failed to clear auth state:', e)
        }
        
        // Show error and redirect
        handleApiError(error, {
          showToast: true,
          customMessage: 'Your session has expired. Please log in again.',
        })
        
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = '/login'
        }, 1500)
        
        return Promise.reject(error)
      }
      
      // Handle all other errors with toast notifications
      handleApiError(error, {
        showToast: true,
      })
      
      return Promise.reject(error)
    }
  )
}

/**
 * Setup both request and response interceptors
 */
export const setupInterceptors = (client: AxiosInstance, serviceName: string) => {
  setupRequestInterceptor(client)
  setupResponseInterceptor(client, serviceName)
}

/**
 * Create a retry interceptor for failed requests
 */
export const setupRetryInterceptor = (
  client: AxiosInstance,
  maxRetries: number = 3,
  retryDelay: number = 1000
) => {
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as any
      
      // Don't retry if we've exceeded max retries
      if (!config || config.__retryCount >= maxRetries) {
        return Promise.reject(error)
      }
      
      // Don't retry on client errors (4xx) except 408 (timeout) and 429 (rate limit)
      if (
        error.response?.status &&
        error.response.status >= 400 &&
        error.response.status < 500 &&
        error.response.status !== 408 &&
        error.response.status !== 429
      ) {
        return Promise.reject(error)
      }
      
      // Initialize retry count
      config.__retryCount = config.__retryCount || 0
      config.__retryCount += 1
      
      // Calculate exponential backoff delay
      const delay = retryDelay * Math.pow(2, config.__retryCount - 1)
      
      console.log(
        `Retrying request (${config.__retryCount}/${maxRetries}) after ${delay}ms:`,
        config.url
      )
      
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay))
      
      // Retry the request
      return client(config)
    }
  )
}

/**
 * Setup global loading indicator
 */
export const setupLoadingInterceptor = (client: AxiosInstance) => {
  let activeRequests = 0
  
  client.interceptors.request.use(
    (config) => {
      activeRequests++
      
      // Update global loading state
      try {
        const storedState = localStorage.getItem('nexus-ecommerce-store')
        if (storedState) {
          const state = JSON.parse(storedState)
          if (state?.state?.ui) {
            state.state.ui.activeRequests = activeRequests
            state.state.ui.isGlobalLoading = activeRequests > 0
            localStorage.setItem('nexus-ecommerce-store', JSON.stringify(state))
          }
        }
      } catch (e) {
        console.error('Failed to update loading state:', e)
      }
      
      return config
    },
    (error) => {
      activeRequests = Math.max(0, activeRequests - 1)
      return Promise.reject(error)
    }
  )
  
  client.interceptors.response.use(
    (response) => {
      activeRequests = Math.max(0, activeRequests - 1)
      
      // Update global loading state
      try {
        const storedState = localStorage.getItem('nexus-ecommerce-store')
        if (storedState) {
          const state = JSON.parse(storedState)
          if (state?.state?.ui) {
            state.state.ui.activeRequests = activeRequests
            state.state.ui.isGlobalLoading = activeRequests > 0
            localStorage.setItem('nexus-ecommerce-store', JSON.stringify(state))
          }
        }
      } catch (e) {
        console.error('Failed to update loading state:', e)
      }
      
      return response
    },
    (error) => {
      activeRequests = Math.max(0, activeRequests - 1)
      
      // Update global loading state
      try {
        const storedState = localStorage.getItem('nexus-ecommerce-store')
        if (storedState) {
          const state = JSON.parse(storedState)
          if (state?.state?.ui) {
            state.state.ui.activeRequests = activeRequests
            state.state.ui.isGlobalLoading = activeRequests > 0
            localStorage.setItem('nexus-ecommerce-store', JSON.stringify(state))
          }
        }
      } catch (e) {
        console.error('Failed to update loading state:', e)
      }
      
      return Promise.reject(error)
    }
  )
}

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number
    }
  }
}
