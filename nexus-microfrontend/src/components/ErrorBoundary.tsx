import { Component, type ErrorInfo, type ReactNode } from 'react'
import Button from './ui/Button'
import Alert from './ui/Alert'

interface Props {
  children: ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
  name?: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

/**
 * ErrorBoundary Component
 * 
 * Catches errors in child component trees and displays a fallback UI.
 * Prevents errors from crashing the entire application.
 * 
 * Features:
 * - Catches errors in child components
 * - Logs error details for debugging
 * - Displays user-friendly fallback UI
 * - Provides reset mechanism to recover
 * - Supports custom fallback components
 * - Calls optional onError callback for error tracking
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const componentName = this.props.name || 'component'
    
    // Log error details for debugging
    console.error(`Error in ${componentName}:`, error, errorInfo)
    
    // Store error info in state for display
    this.setState({ errorInfo })
    
    // Call optional error callback (for error tracking services like Sentry)
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} reset={this.handleReset} />
      }

      // Default fallback UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <Alert variant="error" className="mb-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 text-2xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Something went wrong</h3>
                  <p className="text-sm mb-4">
                    The {this.props.name || 'component'} encountered an error and couldn't be displayed.
                  </p>
                  
                  <details className="text-sm">
                    <summary className="cursor-pointer hover:underline mb-2">
                      View error details
                    </summary>
                    <div className="mt-2 p-3 bg-black/5 dark:bg-white/5 rounded-md overflow-auto">
                      <pre className="text-xs whitespace-pre-wrap break-words">
                        {this.state.error.message}
                        {this.state.errorInfo && (
                          <>
                            {'\n\n'}
                            {this.state.errorInfo.componentStack}
                          </>
                        )}
                      </pre>
                    </div>
                  </details>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      onClick={this.handleReset}
                      variant="primary"
                      size="sm"
                    >
                      Try Again
                    </Button>
                    <Button 
                      onClick={() => window.location.reload()}
                      variant="outline"
                      size="sm"
                    >
                      Reload Page
                    </Button>
                  </div>
                </div>
              </div>
            </Alert>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
