import { cn } from '../../lib/utils'

/**
 * Form Error Components
 * 
 * Components for displaying form validation errors.
 * Provides consistent error styling and accessibility.
 */

interface FormErrorProps {
  message?: string
  className?: string
}

/**
 * FormError Component
 * 
 * Displays a single error message for a form field.
 * Typically used with form validation libraries like React Hook Form.
 */
export const FormError = ({ message, className }: FormErrorProps) => {
  if (!message) return null

  return (
    <p
      className={cn(
        'text-sm font-medium text-red-600 dark:text-red-400 mt-1',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {message}
    </p>
  )
}

interface FormErrorListProps {
  errors: string[]
  className?: string
}

/**
 * FormErrorList Component
 * 
 * Displays multiple error messages as a list.
 * Useful for displaying multiple validation errors at once.
 */
export const FormErrorList = ({ errors, className }: FormErrorListProps) => {
  if (!errors || errors.length === 0) return null

  return (
    <div
      className={cn(
        'mt-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-md',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <ul className="list-disc list-inside space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="text-sm text-red-600 dark:text-red-400">
            {error}
          </li>
        ))}
      </ul>
    </div>
  )
}

interface FieldErrorProps {
  error?: {
    message?: string
    type?: string
  }
  className?: string
}

/**
 * FieldError Component
 * 
 * Displays error for a specific field.
 * Compatible with React Hook Form error format.
 */
export const FieldError = ({ error, className }: FieldErrorProps) => {
  if (!error?.message) return null

  return (
    <FormError message={error.message} className={className} />
  )
}

interface InlineErrorProps {
  message?: string
  icon?: React.ReactNode
  className?: string
}

/**
 * InlineError Component
 * 
 * Displays an inline error message with optional icon.
 * Useful for displaying errors next to form fields or buttons.
 */
export const InlineError = ({ message, icon, className }: InlineErrorProps) => {
  if (!message) return null

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm text-red-600 dark:text-red-400 mt-1',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{message}</span>
    </div>
  )
}

interface FormErrorBannerProps {
  title?: string
  message: string
  errors?: string[]
  onDismiss?: () => void
  className?: string
}

/**
 * FormErrorBanner Component
 * 
 * Displays a prominent error banner at the top of a form.
 * Useful for displaying general form submission errors.
 */
export const FormErrorBanner = ({
  title = 'Error',
  message,
  errors,
  onDismiss,
  className,
}: FormErrorBannerProps) => {
  return (
    <div
      className={cn(
        'p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg',
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-red-600 dark:text-red-400 text-xl">
          ⚠️
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-800 dark:text-red-200 mb-1">
            {title}
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-2">
            {message}
          </p>
          {errors && errors.length > 0 && (
            <ul className="list-disc list-inside space-y-1 text-sm text-red-600 dark:text-red-400">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
            aria-label="Dismiss error"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Helper function to extract error messages from various error formats
 */
export const extractErrorMessages = (error: unknown): string[] => {
  if (!error) return []

  // Handle array of errors
  if (Array.isArray(error)) {
    return error.map((e) => {
      if (typeof e === 'string') return e
      if (e?.message) return e.message
      return String(e)
    })
  }

  // Handle object with errors property
  if (typeof error === 'object' && error !== null) {
    const err = error as any

    // React Hook Form errors format
    if (err.errors) {
      return Object.values(err.errors).map((e: any) => e?.message || String(e))
    }

    // Axios error format
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors
      if (Array.isArray(errors)) {
        return errors.map((e: any) => e?.message || String(e))
      }
      if (typeof errors === 'object') {
        return Object.values(errors).flat().map((e: any) => String(e))
      }
    }

    // Single error message
    if (err.message) {
      return [err.message]
    }
  }

  // Handle string error
  if (typeof error === 'string') {
    return [error]
  }

  return ['An unexpected error occurred']
}
