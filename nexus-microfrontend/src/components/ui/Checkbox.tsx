import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const checkboxClasses = `
      h-4 w-4 rounded border-gray-300 text-primary-600
      focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      disabled:cursor-not-allowed disabled:opacity-50
      ${error ? 'border-error-500' : ''}
      ${className}
    `
    
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            className={checkboxClasses}
            {...props}
          />
        </div>
        {label && (
          <div className="ml-3">
            <label className="text-sm font-medium text-gray-700">
              {label}
            </label>
            {error && (
              <p className="mt-1 text-sm text-error-600">{error}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
