import toast, { Toaster, type Toast as ToastType } from 'react-hot-toast'

/**
 * Toast Notification System
 * 
 * Provides user feedback for various actions and events.
 * Uses react-hot-toast for toast notifications.
 * 
 * Toast Types:
 * - success: Confirmations (item added to cart, order placed)
 * - error: Error messages (API failures, validation errors)
 * - warning: Warning messages (low stock, session expiring)
 * - info: Info messages (background sync, updates available)
 * 
 * Features:
 * - Auto-dismiss after duration
 * - Custom action buttons
 * - Accessible
 * - Customizable position and styling
 */

export interface ToastOptions {
  duration?: number
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Show a success toast notification
 */
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    duration: options?.duration || 4000,
    position: options?.position || 'top-right',
    style: {
      background: '#10b981',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  })
}

/**
 * Show an error toast notification
 */
export const showErrorToast = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    duration: options?.duration || 5000,
    position: options?.position || 'top-right',
    style: {
      background: '#ef4444',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  })
}

/**
 * Show a warning toast notification
 */
export const showWarningToast = (message: string, options?: ToastOptions) => {
  return toast((t: ToastType) => (
    <div className="flex items-center gap-3">
      <span className="text-2xl">⚠️</span>
      <span className="flex-1">{message}</span>
      {options?.action && (
        <button
          onClick={() => {
            options.action?.onClick()
            toast.dismiss(t.id)
          }}
          className="ml-2 px-3 py-1 text-sm font-medium bg-white/20 hover:bg-white/30 rounded transition-colors"
        >
          {options.action.label}
        </button>
      )}
    </div>
  ), {
    duration: options?.duration || 5000,
    position: options?.position || 'top-right',
    style: {
      background: '#f59e0b',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
    },
  })
}

/**
 * Show an info toast notification
 */
export const showInfoToast = (message: string, options?: ToastOptions) => {
  return toast((t: ToastType) => (
    <div className="flex items-center gap-3">
      <span className="text-2xl">ℹ️</span>
      <span className="flex-1">{message}</span>
      {options?.action && (
        <button
          onClick={() => {
            options.action?.onClick()
            toast.dismiss(t.id)
          }}
          className="ml-2 px-3 py-1 text-sm font-medium bg-white/20 hover:bg-white/30 rounded transition-colors"
        >
          {options.action.label}
        </button>
      )}
    </div>
  ), {
    duration: options?.duration || 4000,
    position: options?.position || 'top-right',
    style: {
      background: '#3b82f6',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
    },
  })
}

/**
 * Show a custom toast with action button
 */
export const showToastWithAction = (
  message: string,
  action: { label: string; onClick: () => void },
  options?: Omit<ToastOptions, 'action'>
) => {
  return toast((t: ToastType) => (
    <div className="flex items-center gap-3">
      <span className="flex-1">{message}</span>
      <button
        onClick={() => {
          action.onClick()
          toast.dismiss(t.id)
        }}
        className="ml-2 px-3 py-1 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
      >
        {action.label}
      </button>
    </div>
  ), {
    duration: options?.duration || 6000,
    position: options?.position || 'top-right',
    style: {
      background: '#fff',
      color: '#1f2937',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
  })
}

/**
 * Dismiss a specific toast
 */
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId)
}

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss()
}

/**
 * ToastContainer Component
 * 
 * Must be placed at the root of your application to display toasts.
 * Typically added in App.tsx or main layout component.
 */
export const ToastContainer = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#1f2937',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      }}
    />
  )
}

// Export toast utilities
export { toast }
