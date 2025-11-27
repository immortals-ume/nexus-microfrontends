import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

export interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  options: RadioOption[]
  error?: string
  orientation?: 'vertical' | 'horizontal'
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ options, error, orientation = 'vertical', name, className = '', ...props }, ref) => {
    const containerClasses = orientation === 'horizontal' 
      ? 'flex flex-wrap gap-4' 
      : 'space-y-3'
    
    return (
      <div>
        <div className={containerClasses}>
          {options.map((option, index) => (
            <div key={option.value} className="flex items-center">
              <input
                ref={index === 0 ? ref : undefined}
                type="radio"
                id={`${name}-${option.value}`}
                name={name}
                value={option.value}
                disabled={option.disabled}
                className={`
                  h-4 w-4 border-gray-300 text-primary-600
                  focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  disabled:cursor-not-allowed disabled:opacity-50
                  ${error ? 'border-error-500' : ''}
                  ${className}
                `}
                {...props}
              />
              <label
                htmlFor={`${name}-${option.value}`}
                className="ml-3 text-sm font-medium text-gray-700"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
        {error && (
          <p className="mt-2 text-sm text-error-600">{error}</p>
        )}
      </div>
    )
  }
)

Radio.displayName = 'Radio'

export default Radio
