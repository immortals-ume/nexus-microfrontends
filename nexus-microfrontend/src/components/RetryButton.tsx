import { useState } from 'react'
import Button from './ui/Button'
import Spinner from './ui/Spinner'

/**
 * RetryButton Component
 * 
 * A button that allows users to retry failed operations.
 * Shows loading state during retry and handles errors.
 * 
 * Features:
 * - Loading state during retry
 * - Disabled state to prevent multiple retries
 * - Customizable appearance
 * - Error handling
 */

interface RetryButtonProps {
  onRetry: () => Promise<void> | void
  children?: React.ReactNode
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  showIcon?: boolean
}

export const RetryButton = ({
  onRetry,
  children = 'Retry',
  variant = 'default',
  size = 'md',
  className,
  disabled = false,
  showIcon = true,
}: RetryButtonProps) => {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    if (isRetrying || disabled) return

    setIsRetrying(true)
    try {
      await onRetry()
    } catch (error) {
      console.error('Retry failed:', error)
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <Button
      onClick={handleRetry}
      variant={variant}
      size={size}
      disabled={disabled || isRetrying}
      className={className}
    >
      {isRetrying ? (
        <>
          <Spinner className="mr-2" size="sm" />
          Retrying...
        </>
      ) : (
        <>
          {showIcon && (
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          )}
          {children}
        </>
      )}
    </Button>
  )
}

interface RetryWithMessageProps {
  message: string
  onRetry: () => Promise<void> | void
  className?: string
}

/**
 * RetryWithMessage Component
 * 
 * Displays an error message with a retry button.
 * Useful for inline error states.
 */
export const RetryWithMessage = ({
  message,
  onRetry,
  className,
}: RetryWithMessageProps) => {
  return (
    <div className={`flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg ${className || ''}`}>
      <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
      <RetryButton onRetry={onRetry} size="sm" />
    </div>
  )
}

interface NetworkErrorRetryProps {
  onRetry: () => Promise<void> | void
  className?: string
}

/**
 * NetworkErrorRetry Component
 * 
 * Specialized retry component for network errors.
 * Displays a network error message with retry button.
 */
export const NetworkErrorRetry = ({
  onRetry,
  className,
}: NetworkErrorRetryProps) => {
  return (
    <div className={`text-center p-6 ${className || ''}`}>
      <div className="text-4xl mb-3">📡</div>
      <h3 className="font-semibold text-lg mb-2">Connection Error</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Unable to connect to the server. Please check your internet connection.
      </p>
      <RetryButton onRetry={onRetry} />
    </div>
  )
}

interface LoadingErrorRetryProps {
  error: Error
  onRetry: () => Promise<void> | void
  className?: string
}

/**
 * LoadingErrorRetry Component
 * 
 * Displays a loading error with retry button.
 * Useful for data fetching errors.
 */
export const LoadingErrorRetry = ({
  error,
  onRetry,
  className,
}: LoadingErrorRetryProps) => {
  return (
    <div className={`text-center p-6 ${className || ''}`}>
      <div className="text-4xl mb-3">⚠️</div>
      <h3 className="font-semibold text-lg mb-2">Failed to Load</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {error.message || 'An error occurred while loading the data.'}
      </p>
      <RetryButton onRetry={onRetry} />
    </div>
  )
}
