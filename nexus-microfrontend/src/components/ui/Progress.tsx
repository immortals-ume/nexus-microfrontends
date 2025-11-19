import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
  showLabel?: boolean
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, max = 100, size = 'md', variant = 'default', showLabel = false, className = '', ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    const sizeStyles = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    }
    
    const variantStyles = {
      default: 'bg-primary-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      error: 'bg-red-600',
    }
    
    return (
      <div ref={ref} className={`w-full ${className}`} {...props}>
        <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeStyles[size]}`}>
          <div
            className={`${sizeStyles[size]} ${variantStyles[variant]} transition-all duration-300 ease-in-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <div className="mt-1 text-sm text-gray-600 text-right">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    )
  }
)

Progress.displayName = 'Progress'

export default Progress
