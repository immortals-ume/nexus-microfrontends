import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, checked, className = '', ...props }, ref) => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {label && (
            <label className="text-sm font-medium text-gray-700">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            className="sr-only peer"
            {...props}
          />
          <div className={`
            w-11 h-6 bg-gray-200 rounded-full peer
            peer-focus:ring-4 peer-focus:ring-primary-300
            peer-checked:after:translate-x-full peer-checked:after:border-white
            after:content-[''] after:absolute after:top-0.5 after:left-[2px]
            after:bg-white after:border-gray-300 after:border after:rounded-full
            after:h-5 after:w-5 after:transition-all
            peer-checked:bg-primary-600
            ${className}
          `}></div>
        </label>
      </div>
    )
  }
)

Switch.displayName = 'Switch'

export default Switch
