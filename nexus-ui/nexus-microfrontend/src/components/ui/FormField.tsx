import type { ReactNode } from 'react'

export interface FormFieldProps {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  children: ReactNode
}

const FormField = ({ label, error, helperText, required, children }: FormFieldProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

export default FormField
