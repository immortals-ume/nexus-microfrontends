# Error Handling & User Feedback System

Production-grade error handling implementation for the Nexus e-commerce platform.

## Overview

This system provides comprehensive error handling across all layers of the application:
- **ErrorBoundary**: React error boundaries for component-level error catching
- **Toast Notifications**: User-friendly feedback system using react-hot-toast
- **Global Error Handler**: Centralized API error handling with automatic retry
- **Form Validation**: Consistent error display for form inputs
- **Retry Mechanisms**: Network error recovery with exponential backoff

## Components

### 1. ErrorBoundary Component

Production-ready error boundary that catches errors in component trees.

**Location**: `src/components/ErrorBoundary.tsx`

**Features**:
- Catches errors in child components
- Logs errors for debugging
- Displays user-friendly fallback UI
- Provides reset mechanism
- Supports custom fallback components
- Optional error callback for tracking services (Sentry, DataDog)

**Usage**:
```tsx
import ErrorBoundary from './components/ErrorBoundary'
import { GenericErrorFallback } from './components/ErrorFallback'

// Wrap microfrontends
<ErrorBoundary
  name="Product Microfrontend"
  fallback={GenericErrorFallback}
  onError={(error, errorInfo) => {
    // Send to error tracking service
    Sentry.captureException(error, { extra: errorInfo })
  }}
>
  <ProductMicrofrontend />
</ErrorBoundary>
```

### 2. Toast Notification System

User feedback system using react-hot-toast.

**Location**: `src/components/ui/Toast.tsx`

**Features**:
- Success, error, warning, and info toasts
- Auto-dismiss with configurable duration
- Action buttons for interactive toasts
- Accessible and keyboard-navigable
- Customizable position and styling

**Usage**:
```tsx
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
  showToastWithAction,
} from './components/ui/Toast'

// Success notification
showSuccessToast('Item added to cart!')

// Error with retry action
showErrorToast('Failed to load products', {
  action: {
    label: 'Retry',
    onClick: () => refetch(),
  },
})

// Warning with custom duration
showWarningToast('Low stock warning', {
  duration: 6000,
})

// Info notification
showInfoToast('New features available')

// Custom toast with action
showToastWithAction(
  'Item removed from cart',
  {
    label: 'Undo',
    onClick: () => restoreItem(),
  }
)
```

**Setup**:
Add `<ToastContainer />` to your root component (already added to App.tsx):
```tsx
import { ToastContainer } from './components/ui/Toast'

function App() {
  return (
    <>
      <YourApp />
      <ToastContainer />
    </>
  )
}
```

### 3. Error Fallback Components

Reusable fallback UI components for different error scenarios.

**Location**: `src/components/ErrorFallback.tsx`

**Available Fallbacks**:
- `GenericErrorFallback`: Default fallback for unexpected errors
- `NetworkErrorFallback`: Network-specific errors
- `NotFoundErrorFallback`: 404 errors
- `PermissionErrorFallback`: 403 permission errors
- `MicrofrontendErrorFallback`: Microfrontend loading errors
- `CompactErrorFallback`: Minimal inline error display

**Usage**:
```tsx
import { NetworkErrorFallback } from './components/ErrorFallback'

<ErrorBoundary
  name="API Data"
  fallback={NetworkErrorFallback}
>
  <DataComponent />
</ErrorBoundary>
```

### 4. Global Error Handler

Centralized error handling utility for API requests.

**Location**: `src/utils/errorHandler.ts`

**Features**:
- Extracts error messages from various formats
- Provides default messages based on HTTP status codes
- Automatic toast notifications
- Error logging for debugging
- Type guards for error classification

**Usage**:
```tsx
import { handleApiError, isNetworkError } from './utils/errorHandler'

try {
  const data = await fetchProducts()
} catch (error) {
  // Automatically shows toast and logs error
  handleApiError(error, {
    showToast: true,
    customMessage: 'Failed to load products',
    onRetry: () => refetch(),
  })
  
  // Check error type
  if (isNetworkError(error)) {
    // Handle network-specific logic
  }
}
```

**Helper Functions**:
- `getErrorMessage(error)`: Extract error message
- `getDefaultErrorMessage(status)`: Get message for HTTP status
- `handleApiError(error, options)`: Handle error with toast
- `isNetworkError(error)`: Check if network error
- `isAuthError(error)`: Check if 401 error
- `isPermissionError(error)`: Check if 403 error
- `isValidationError(error)`: Check if 422/400 error
- `isServerError(error)`: Check if 5xx error
- `logError(error, context)`: Log error with context

### 5. Axios Interceptors

Centralized request/response interceptors for all service clients.

**Location**: `src/services/axiosInterceptors.ts`

**Features**:
- Automatic authentication token injection
- Global error handling with toast notifications
- Automatic retry with exponential backoff
- Performance monitoring (request timing)
- Global loading state management
- Auth state cleanup on 401 errors

**Interceptors**:
- `setupRequestInterceptor`: Adds auth tokens to requests
- `setupResponseInterceptor`: Handles errors and logging
- `setupRetryInterceptor`: Retries failed requests
- `setupLoadingInterceptor`: Manages global loading state
- `setupInterceptors`: Sets up all interceptors

**Usage** (already applied to all service clients):
```tsx
import { setupInterceptors, setupRetryInterceptor } from './axiosInterceptors'

const client = axios.create({ baseURL: '...' })
setupInterceptors(client, 'ServiceName')
setupRetryInterceptor(client, 3, 1000) // 3 retries, 1s initial delay
```

### 6. Form Error Components

Consistent error display for form validation.

**Location**: `src/components/ui/FormError.tsx`

**Components**:
- `FormError`: Single field error message
- `FormErrorList`: Multiple errors as a list
- `FieldError`: React Hook Form compatible
- `InlineError`: Inline error with icon
- `FormErrorBanner`: Prominent form-level error

**Usage**:
```tsx
import { FormError, FormErrorBanner, FieldError } from './components/ui/FormError'

// Single field error
<input type="email" />
<FormError message={errors.email} />

// Form-level error banner
<FormErrorBanner
  title="Validation Failed"
  message="Please fix the errors below"
  errors={Object.values(errors)}
  onDismiss={() => clearErrors()}
/>

// React Hook Form integration
<FieldError error={errors.email} />

// Inline error with icon
<InlineError
  message="Password must be at least 8 characters"
  icon={<span>⚠️</span>}
/>
```

### 7. Retry Button Components

Interactive retry buttons for failed operations.

**Location**: `src/components/RetryButton.tsx`

**Components**:
- `RetryButton`: Basic retry button with loading state
- `RetryWithMessage`: Error message with retry button
- `NetworkErrorRetry`: Network error with retry
- `LoadingErrorRetry`: Data loading error with retry

**Usage**:
```tsx
import { RetryButton, NetworkErrorRetry } from './components/RetryButton'

// Basic retry button
<RetryButton
  onRetry={async () => await refetch()}
  variant="default"
  size="md"
>
  Retry
</RetryButton>

// Network error display
{isNetworkError && (
  <NetworkErrorRetry onRetry={refetch} />
)}

// Loading error display
{error && (
  <LoadingErrorRetry
    error={error}
    onRetry={refetch}
  />
)}
```

## Service Client Integration

All service clients now use centralized error handling:

**Updated Clients**:
- ✅ ProductServiceClient
- ✅ OrderServiceClient
- ✅ CustomerServiceClient
- ✅ PaymentServiceClient
- ✅ AuthServiceClient
- ✅ NotificationServiceClient

**Features**:
- Automatic auth token injection
- Global error handling with toasts
- Automatic retry (3 attempts with exponential backoff)
- Performance monitoring
- Auth state cleanup on 401

**Example** (ProductServiceClient):
```tsx
import { ProductServiceClient } from './services/ProductServiceClient'

const productService = new ProductServiceClient()

// Errors are automatically handled
try {
  const products = await productService.getAll()
  showSuccessToast('Products loaded!')
} catch (error) {
  // Error already logged and toast shown
  // Handle any additional logic here
}
```

## Error Handling Patterns

### Pattern 1: API Calls with React Query

```tsx
import { useQuery } from '@tanstack/react-query'
import { handleApiError } from './utils/errorHandler'
import { LoadingErrorRetry } from './components/RetryButton'

function ProductList() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        return await productService.getAll()
      } catch (err) {
        handleApiError(err, { showToast: true })
        throw err
      }
    },
  })

  if (isLoading) return <Skeleton />
  if (error) return <LoadingErrorRetry error={error} onRetry={refetch} />

  return <ProductGrid products={data} />
}
```

### Pattern 2: Form Submission

```tsx
import { useState } from 'react'
import { FormErrorBanner, FormError } from './components/ui/FormError'
import { showSuccessToast } from './components/ui/Toast'
import { handleApiError } from './utils/errorHandler'

function LoginForm() {
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setFormError('')

    try {
      await authService.login(credentials)
      showSuccessToast('Login successful!')
    } catch (error) {
      const apiError = handleApiError(error, { showToast: false })
      
      if (apiError.details?.errors) {
        setErrors(apiError.details.errors)
      }
      setFormError(apiError.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {formError && (
        <FormErrorBanner
          message={formError}
          errors={Object.values(errors)}
          onDismiss={() => setFormError('')}
        />
      )}
      
      <input type="email" name="email" />
      <FormError message={errors.email} />
      
      <input type="password" name="password" />
      <FormError message={errors.password} />
      
      <button type="submit">Login</button>
    </form>
  )
}
```

### Pattern 3: Microfrontend Loading

```tsx
import { Suspense, lazy } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import { MicrofrontendErrorFallback } from './components/ErrorFallback'

const ProductMFE = lazy(() => import('product/App'))

function App() {
  return (
    <ErrorBoundary
      name="Product Microfrontend"
      fallback={MicrofrontendErrorFallback}
      onError={(error, errorInfo) => {
        // Send to error tracking
        console.error('MFE Error:', error, errorInfo)
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <ProductMFE />
      </Suspense>
    </ErrorBoundary>
  )
}
```

### Pattern 4: Network Error Recovery

```tsx
import { useState, useEffect } from 'react'
import { isNetworkError } from './utils/errorHandler'
import { NetworkErrorRetry } from './components/RetryButton'

function DataComponent() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiService.getData()
      setData(result)
    } catch (err) {
      setError(err)
      
      if (!isNetworkError(err)) {
        handleApiError(err, { showToast: true })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <Spinner />
  if (error && isNetworkError(error)) {
    return <NetworkErrorRetry onRetry={fetchData} />
  }
  if (error) return <GenericErrorFallback error={error} reset={fetchData} />

  return <DataDisplay data={data} />
}
```

## Testing

All error handling components are tested:
- ✅ ErrorBoundary catches and displays errors
- ✅ Toast notifications appear and dismiss
- ✅ Form errors display correctly
- ✅ Retry buttons work with loading states
- ✅ Service clients handle errors properly
- ✅ Interceptors add auth tokens and retry requests

Run tests:
```bash
npm run test:run
```

## Best Practices

1. **Always wrap microfrontends in ErrorBoundary**
   - Prevents cascading failures
   - Provides graceful degradation

2. **Use toast notifications for user feedback**
   - Success: Confirmations
   - Error: Failures with retry options
   - Warning: Important notices
   - Info: Background updates

3. **Handle API errors consistently**
   - Use `handleApiError` for all API calls
   - Provide retry options for network errors
   - Show specific messages for validation errors

4. **Display form errors inline**
   - Use `FormError` for field-level errors
   - Use `FormErrorBanner` for form-level errors
   - Clear errors on successful submission

5. **Provide retry mechanisms**
   - Network errors should always have retry buttons
   - Use exponential backoff for automatic retries
   - Limit retry attempts to prevent infinite loops

6. **Log errors for debugging**
   - All errors are logged to console
   - Include context and timestamps
   - Send critical errors to tracking services

7. **Test error scenarios**
   - Test network failures
   - Test validation errors
   - Test authentication failures
   - Test component crashes

## Error Tracking Integration

To integrate with error tracking services (Sentry, DataDog, etc.):

```tsx
// In ErrorBoundary
<ErrorBoundary
  name="App"
  onError={(error, errorInfo) => {
    Sentry.captureException(error, {
      extra: errorInfo,
      tags: {
        component: 'App',
        environment: process.env.NODE_ENV,
      },
    })
  }}
>
  <App />
</ErrorBoundary>

// In error handler
import * as Sentry from '@sentry/react'

export const handleApiError = (error: unknown, options?: ErrorOptions) => {
  const apiError = extractApiError(error)
  
  // Send to Sentry
  if (apiError.status >= 500) {
    Sentry.captureException(error, {
      extra: { apiError },
      level: 'error',
    })
  }
  
  // Show toast
  if (options?.showToast) {
    showErrorToast(apiError.message, options)
  }
  
  return apiError
}
```

## Summary

This error handling system provides:
- ✅ Comprehensive error catching at all levels
- ✅ User-friendly feedback with toast notifications
- ✅ Automatic retry with exponential backoff
- ✅ Consistent error display across the application
- ✅ Production-ready logging and monitoring
- ✅ Graceful degradation for failed components
- ✅ Network error recovery
- ✅ Form validation error display

All components are production-ready and fully tested.
