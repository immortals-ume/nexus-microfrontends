import Spinner from './Spinner'

/**
 * Loading State Components
 * 
 * Reusable loading state components for different scenarios:
 * - Full page loading
 * - Inline loading
 * - Button loading
 * - Overlay loading
 */

export interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Full Page Loading
 * Centers loading indicator in the middle of the page
 */
export function PageLoading({ message = 'Loading...', size = 'lg', className = '' }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] ${className}`}>
      <Spinner size={size} />
      {message && (
        <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  )
}

/**
 * Inline Loading
 * Small loading indicator for inline use
 */
export function InlineLoading({ message, size = 'sm', className = '' }: LoadingStateProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Spinner size={size} />
      {message && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {message}
        </span>
      )}
    </div>
  )
}

/**
 * Button Loading
 * Loading state for buttons
 */
export function ButtonLoading({ message, size = 'sm', className = '' }: LoadingStateProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <Spinner size={size} />
      {message && <span>{message}</span>}
    </span>
  )
}

/**
 * Overlay Loading
 * Full screen overlay with loading indicator
 */
export function OverlayLoading({ message = 'Processing...', size = 'lg', className = '' }: LoadingStateProps) {
  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-2xl flex flex-col items-center gap-4 animate-scale-in">
        <Spinner size={size} />
        {message && (
          <p className="text-gray-900 dark:text-white font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * Section Loading
 * Loading state for a section of the page
 */
export function SectionLoading({ message, size = 'md', className = '' }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <Spinner size={size} />
      {message && (
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          {message}
        </p>
      )}
    </div>
  )
}

/**
 * Card Loading
 * Loading state for card components
 */
export function CardLoading({ message, size = 'md', className = '' }: LoadingStateProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center justify-center min-h-[200px] ${className}`}>
      <Spinner size={size} />
      {message && (
        <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
          {message}
        </p>
      )}
    </div>
  )
}

/**
 * Global Loading Indicator
 * Fixed position loading bar at the top of the page
 */
export function GlobalLoadingBar({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary-600 animate-pulse">
      <div className="h-full bg-primary-400 animate-[shimmer_1s_ease-in-out_infinite]" />
    </div>
  )
}

/**
 * Suspense Fallback
 * Loading fallback for React Suspense
 */
export function SuspenseFallback({ name }: { name?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] animate-fade-in">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Loading {name || 'content'}...
      </p>
    </div>
  )
}
