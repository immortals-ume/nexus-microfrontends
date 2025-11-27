/**
 * Higher-Order Components (HOCs) for the Nexus e-commerce application
 */

export { withAuth, withAdminAuth, withGuest, type WithAuthOptions } from './withAuth';
export {
  withLoading,
  withCustomLoading,
  withSkeleton,
  withLoadingAndError,
  type WithLoadingProps,
  type WithLoadingAndErrorProps,
  type LoadingComponentProps,
} from './withLoading';
export {
  withErrorBoundary,
  withCompactErrorBoundary,
  CompactErrorFallback,
  type ErrorFallbackProps,
} from './withErrorBoundary';
