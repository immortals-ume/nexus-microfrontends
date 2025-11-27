import React, { Component, ComponentType, ReactNode } from 'react';

/**
 * Error boundary state
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Props for error fallback component
 */
export interface ErrorFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo;
  resetError: () => void;
}

/**
 * Higher-Order Component that wraps a component with an error boundary
 * Catches JavaScript errors anywhere in the child component tree
 * 
 * @example
 * const SafeProductList = withErrorBoundary(ProductList);
 * const SafeDashboard = withErrorBoundary(Dashboard, CustomErrorFallback);
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  FallbackComponent: ComponentType<ErrorFallbackProps> = DefaultErrorFallback,
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
) {
  return class WithErrorBoundary extends Component<P, ErrorBoundaryState> {
    constructor(props: P) {
      super(props);
      this.state = {
        hasError: false,
        error: null,
        errorInfo: null,
      };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
      return {
        hasError: true,
        error,
      };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
      // Log error to console
      console.error('Error caught by boundary:', error, errorInfo);

      // Update state with error info
      this.setState({
        errorInfo,
      });

      // Call custom error handler if provided
      if (onError) {
        onError(error, errorInfo);
      }
    }

    resetError = (): void => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    };

    render(): ReactNode {
      const { hasError, error, errorInfo } = this.state;

      if (hasError && error && errorInfo) {
        return (
          <FallbackComponent
            error={error}
            errorInfo={errorInfo}
            resetError={this.resetError}
          />
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
}

/**
 * Default error fallback component
 */
function DefaultErrorFallback({ error, errorInfo, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              We're sorry, but something unexpected happened. Please try again.
            </p>
            
            <details className="mb-4">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                Error details
              </summary>
              <div className="mt-2 p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-sm font-mono text-red-600 mb-2">
                  {error.toString()}
                </p>
                <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                  {errorInfo.componentStack}
                </pre>
              </div>
            </details>

            <div className="flex space-x-3">
              <button
                onClick={resetError}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go to homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact error fallback for smaller components
 */
export function CompactErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start space-x-3">
        <svg
          className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="text-sm text-red-700 mt-1">{error.message}</p>
          <button
            onClick={resetError}
            className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * HOC with compact error fallback
 */
export function withCompactErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
) {
  return withErrorBoundary(Component, CompactErrorFallback, onError);
}
