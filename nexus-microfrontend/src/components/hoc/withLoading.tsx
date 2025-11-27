import React, { ComponentType } from 'react';
import { Spinner } from '../ui/Spinner';

/**
 * Higher-Order Component that shows a loading state while data is being fetched
 * 
 * @example
 * const ProductListWithLoading = withLoading(ProductList);
 * <ProductListWithLoading isLoading={isLoading} products={products} />
 */
export interface WithLoadingProps {
  isLoading: boolean;
}

export interface LoadingComponentProps {
  message?: string;
}

export function withLoading<P extends object>(
  Component: ComponentType<P>,
  LoadingComponent: ComponentType<LoadingComponentProps> = DefaultLoadingComponent
) {
  return function ComponentWithLoading(props: P & WithLoadingProps) {
    const { isLoading, ...rest } = props;

    if (isLoading) {
      return <LoadingComponent />;
    }

    return <Component {...(rest as P)} />;
  };
}

/**
 * Default loading component
 */
function DefaultLoadingComponent({ message = 'Loading...' }: LoadingComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Spinner size="lg" />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
}

/**
 * HOC with custom loading component
 */
export function withCustomLoading<P extends object>(
  Component: ComponentType<P>,
  customLoadingComponent: ComponentType<LoadingComponentProps>
) {
  return withLoading(Component, customLoadingComponent);
}

/**
 * HOC that shows skeleton loading state
 */
export function withSkeleton<P extends object>(
  Component: ComponentType<P>,
  SkeletonComponent: ComponentType
) {
  return function ComponentWithSkeleton(props: P & WithLoadingProps) {
    const { isLoading, ...rest } = props;

    if (isLoading) {
      return <SkeletonComponent />;
    }

    return <Component {...(rest as P)} />;
  };
}

/**
 * HOC that handles both loading and error states
 */
export interface WithLoadingAndErrorProps {
  isLoading: boolean;
  error?: Error | null;
}

export function withLoadingAndError<P extends object>(
  Component: ComponentType<P>,
  LoadingComponent: ComponentType<LoadingComponentProps> = DefaultLoadingComponent,
  ErrorComponent: ComponentType<{ error: Error }> = DefaultErrorComponent
) {
  return function ComponentWithLoadingAndError(props: P & WithLoadingAndErrorProps) {
    const { isLoading, error, ...rest } = props;

    if (error) {
      return <ErrorComponent error={error} />;
    }

    if (isLoading) {
      return <LoadingComponent />;
    }

    return <Component {...(rest as P)} />;
  };
}

/**
 * Default error component
 */
function DefaultErrorComponent({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="text-red-500">
        <svg
          className="w-16 h-16"
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
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-sm text-gray-600">{error.message}</p>
      </div>
    </div>
  );
}
