import Button from './ui/Button'
import Alert from './ui/Alert'

/**
 * Error Fallback Components
 * 
 * Reusable fallback UI components for different error scenarios.
 * Can be used with ErrorBoundary or directly in components.
 */

interface ErrorFallbackProps {
  error: Error
  reset: () => void
}

/**
 * Generic Error Fallback
 * 
 * Default fallback for unexpected errors
 */
export const GenericErrorFallback = ({ error, reset }: ErrorFallbackProps) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <Alert variant="error">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 text-2xl">⚠️</div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Something went wrong</h3>
              <p className="text-sm mb-4">
                We encountered an unexpected error. Please try again.
              </p>
              
              <details className="text-sm mb-4">
                <summary className="cursor-pointer hover:underline">
                  View error details
                </summary>
                <div className="mt-2 p-3 bg-black/5 dark:bg-white/5 rounded-md overflow-auto">
                  <pre className="text-xs whitespace-pre-wrap break-words">
                    {error.message}
                  </pre>
                </div>
              </details>
              
              <div className="flex gap-2">
                <Button onClick={reset} variant="primary" size="sm">
                  Try Again
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  size="sm"
                >
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </Alert>
      </div>
    </div>
  )
}

/**
 * Network Error Fallback
 * 
 * Fallback for network-related errors
 */
export const NetworkErrorFallback = ({ error, reset }: ErrorFallbackProps) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">📡</div>
        <h3 className="font-semibold text-xl mb-2">Connection Error</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We couldn't connect to the server. Please check your internet connection and try again.
        </p>
        
        <div className="flex gap-2 justify-center">
          <Button onClick={reset} variant="primary">
            Retry Connection
          </Button>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Reload Page
          </Button>
        </div>
        
        <details className="mt-6 text-sm text-left">
          <summary className="cursor-pointer hover:underline text-center">
            Technical details
          </summary>
          <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto">
            <pre className="text-xs whitespace-pre-wrap break-words">
              {error.message}
            </pre>
          </div>
        </details>
      </div>
    </div>
  )
}

/**
 * Not Found Error Fallback
 * 
 * Fallback for 404 errors
 */
export const NotFoundErrorFallback = ({ reset }: Omit<ErrorFallbackProps, 'error'>) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="font-semibold text-xl mb-2">Page Not Found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex gap-2 justify-center">
          <Button onClick={reset} variant="primary">
            Go Back
          </Button>
          <Button 
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Permission Error Fallback
 * 
 * Fallback for 403 permission errors
 */
export const PermissionErrorFallback = ({ reset }: Omit<ErrorFallbackProps, 'error'>) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="font-semibold text-xl mb-2">Access Denied</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="flex gap-2 justify-center">
          <Button onClick={reset} variant="primary">
            Go Back
          </Button>
          <Button 
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Microfrontend Load Error Fallback
 * 
 * Fallback for microfrontend loading errors
 */
export const MicrofrontendErrorFallback = ({ reset }: Omit<ErrorFallbackProps, 'error'>) => {
  return (
    <div className="min-h-[200px] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <Alert variant="error">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 text-2xl">📦</div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Module Failed to Load</h3>
              <p className="text-sm mb-4">
                This feature couldn't be loaded. This might be a temporary issue.
              </p>
              
              <Button onClick={reset} variant="primary" size="sm">
                Retry Loading
              </Button>
            </div>
          </div>
        </Alert>
      </div>
    </div>
  )
}

/**
 * Compact Error Fallback
 * 
 * Minimal fallback for inline errors
 */
export const CompactErrorFallback = ({ error, reset }: ErrorFallbackProps) => {
  return (
    <div className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 rounded-lg">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-red-600 dark:text-red-400">⚠️</span>
          <span className="text-sm text-red-800 dark:text-red-200">
            {error.message || 'An error occurred'}
          </span>
        </div>
        <Button onClick={reset} variant="outline" size="sm">
          Retry
        </Button>
      </div>
    </div>
  )
}
