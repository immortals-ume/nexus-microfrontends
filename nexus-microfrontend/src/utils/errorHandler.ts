import { AxiosError } from 'axios'
import { showErrorToast, showWarningToast } from '../components/ui/Toast'

/**
 * API Error Handler Utility
 * 
 * Centralized error handling for API requests.
 * Provides consistent error messages and logging.
 */

export interface ApiError {
  status: number
  message: string
  code: string
  details?: Record<string, any>
}

/**
 * Extract error message from various error formats
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // Check for response error message
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    
    // Check for validation errors
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      if (Array.isArray(errors)) {
        return errors.map((e: any) => e.message || e).join(', ')
      }
      if (typeof errors === 'object') {
        return Object.values(errors).flat().join(', ')
      }
    }
    
    // Default messages based on status code
    if (error.response?.status) {
      return getDefaultErrorMessage(error.response.status)
    }
    
    // Network errors
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.'
    }
    
    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your connection.'
    }
    
    return error.message || 'An unexpected error occurred'
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return 'An unexpected error occurred'
}

/**
 * Get default error message based on HTTP status code
 */
export const getDefaultErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.'
    case 401:
      return 'You need to log in to access this resource.'
    case 403:
      return 'You don\'t have permission to access this resource.'
    case 404:
      return 'The requested resource was not found.'
    case 409:
      return 'This action conflicts with existing data.'
    case 422:
      return 'Validation failed. Please check your input.'
    case 429:
      return 'Too many requests. Please try again later.'
    case 500:
      return 'Server error. Please try again later.'
    case 502:
      return 'Bad gateway. The server is temporarily unavailable.'
    case 503:
      return 'Service unavailable. Please try again later.'
    case 504:
      return 'Gateway timeout. The server took too long to respond.'
    default:
      return 'An error occurred. Please try again.'
  }
}

/**
 * Handle API errors with appropriate user feedback
 */
export const handleApiError = (error: unknown, options?: {
  showToast?: boolean
  customMessage?: string
  onRetry?: () => void
}): ApiError => {
  const message = options?.customMessage || getErrorMessage(error)
  
  // Extract status code
  let status = 500
  if (error instanceof AxiosError && error.response?.status) {
    status = error.response.status
  }
  
  // Log error for debugging
  console.error('API Error:', {
    status,
    message,
    error,
    timestamp: new Date().toISOString(),
  })
  
  // Show toast notification if enabled
  if (options?.showToast !== false) {
    if (status === 401) {
      showWarningToast('Please log in to continue', {
        action: {
          label: 'Login',
          onClick: () => {
            window.location.href = '/login'
          },
        },
      })
    } else if (status >= 500) {
      showErrorToast(message, {
        action: options?.onRetry ? {
          label: 'Retry',
          onClick: options.onRetry,
        } : undefined,
      })
    } else {
      showErrorToast(message)
    }
  }
  
  return {
    status,
    message,
    code: error instanceof AxiosError ? error.code || 'UNKNOWN' : 'UNKNOWN',
    details: error instanceof AxiosError ? error.response?.data : undefined,
  }
}

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return !error.response && (
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      error.message.includes('Network Error')
    )
  }
  return false
}

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401
  }
  return false
}

/**
 * Check if error is a permission error
 */
export const isPermissionError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 403
  }
  return false
}

/**
 * Check if error is a validation error
 */
export const isValidationError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 422 || error.response?.status === 400
  }
  return false
}

/**
 * Check if error is a server error
 */
export const isServerError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status ? error.response.status >= 500 : false
  }
  return false
}

/**
 * Log error to console with context
 */
export const logError = (error: unknown, context?: string) => {
  const timestamp = new Date().toISOString()
  const errorMessage = getErrorMessage(error)
  
  console.error(`[${timestamp}] Error${context ? ` in ${context}` : ''}:`, {
    message: errorMessage,
    error,
    stack: error instanceof Error ? error.stack : undefined,
  })
}
