/**
 * Factory Pattern for Form Field Generation
 * 
 * This pattern creates form fields dynamically based on configuration
 * Useful for generating forms from schemas or API responses
 * 
 * Benefits:
 * - DRY (Don't Repeat Yourself)
 * - Consistent form field styling
 * - Easy to add new field types
 * - Type-safe field generation
 */

import React, { ComponentType } from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import { Label } from '../ui/Label';

/**
 * Field configuration types
 */
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'file';

export interface BaseFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | undefined;
  };
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select';
  options: Array<{ value: string; label: string }>;
  multiple?: boolean;
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox';
  checkboxLabel?: string;
}

export interface RadioFieldConfig extends BaseFieldConfig {
  type: 'radio';
  options: Array<{ value: string; label: string }>;
}

export type FieldConfig =
  | BaseFieldConfig
  | SelectFieldConfig
  | CheckboxFieldConfig
  | RadioFieldConfig;

/**
 * Form field props
 */
export interface FormFieldProps {
  config: FieldConfig;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  onBlur?: () => void;
}

/**
 * Factory function to create form fields
 */
export function createFormField(config: FieldConfig): ComponentType<FormFieldProps> {
  return function FormField({ config, value, error, onChange, onBlur }: FormFieldProps) {
    const { name, label, type, placeholder, required, disabled, helperText } = config;

    // Common wrapper for all fields
    const FieldWrapper = ({ children }: { children: React.ReactNode }) => (
      <div className="space-y-2">
        {type !== 'checkbox' && (
          <Label htmlFor={name} className={required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
            {label}
          </Label>
        )}
        {children}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );

    // Render different field types
    switch (type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'url':
      case 'date':
        return (
          <FieldWrapper>
            <Input
              id={name}
              name={name}
              type={type}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              className={error ? 'border-red-500 focus:ring-red-500' : ''}
            />
          </FieldWrapper>
        );

      case 'textarea':
        return (
          <FieldWrapper>
            <Textarea
              id={name}
              name={name}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              rows={4}
              className={error ? 'border-red-500 focus:ring-red-500' : ''}
            />
          </FieldWrapper>
        );

      case 'select': {
        const selectConfig = config as SelectFieldConfig;
        return (
          <FieldWrapper>
            <Select
              id={name}
              name={name}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              required={required}
              disabled={disabled}
              className={error ? 'border-red-500 focus:ring-red-500' : ''}
            >
              <option value="">Select {label}</option>
              {selectConfig.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FieldWrapper>
        );
      }

      case 'checkbox': {
        const checkboxConfig = config as CheckboxFieldConfig;
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={name}
              name={name}
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              onBlur={onBlur}
              disabled={disabled}
            />
            <Label htmlFor={name} className="cursor-pointer">
              {checkboxConfig.checkboxLabel || label}
            </Label>
          </div>
        );
      }

      case 'radio': {
        const radioConfig = config as RadioFieldConfig;
        return (
          <FieldWrapper>
            <div className="space-y-2">
              {radioConfig.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${name}-${option.value}`}
                    name={name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    disabled={disabled}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <Label htmlFor={`${name}-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </FieldWrapper>
        );
      }

      case 'file':
        return (
          <FieldWrapper>
            <input
              type="file"
              id={name}
              name={name}
              onChange={(e) => onChange(e.target.files?.[0])}
              onBlur={onBlur}
              required={required}
              disabled={disabled}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
          </FieldWrapper>
        );

      default:
        return <div>Unsupported field type: {type}</div>;
    }
  };
}

/**
 * Form generator that creates a complete form from configuration
 */
export interface FormGeneratorProps {
  fields: FieldConfig[];
  values: Record<string, any>;
  errors?: Record<string, string>;
  onChange: (name: string, value: any) => void;
  onBlur?: (name: string) => void;
  onSubmit: (values: Record<string, any>) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  className?: string;
}

export function FormGenerator({
  fields,
  values,
  errors = {},
  onChange,
  onBlur,
  onSubmit,
  submitLabel = 'Submit',
  isSubmitting = false,
  className = '',
}: FormGeneratorProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {fields.map((fieldConfig) => {
        const Field = createFormField(fieldConfig);
        return (
          <Field
            key={fieldConfig.name}
            config={fieldConfig}
            value={values[fieldConfig.name]}
            error={errors[fieldConfig.name]}
            onChange={(value) => onChange(fieldConfig.name, value)}
            onBlur={() => onBlur?.(fieldConfig.name)}
          />
        );
      })}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Submitting...' : submitLabel}
      </button>
    </form>
  );
}

/**
 * Example: User Registration Form
 */
export function UserRegistrationFormExample() {
  const [values, setValues] = React.useState<Record<string, any>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const fields: FieldConfig[] = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'John',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Doe',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'john.doe@example.com',
      required: true,
      helperText: 'We will never share your email',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
      required: true,
      helperText: 'Must be at least 8 characters',
      validation: {
        minLength: 8,
      },
    },
    {
      name: 'country',
      label: 'Country',
      type: 'select',
      required: true,
      options: [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'au', label: 'Australia' },
      ],
    } as SelectFieldConfig,
    {
      name: 'bio',
      label: 'Bio',
      type: 'textarea',
      placeholder: 'Tell us about yourself...',
      helperText: 'Optional',
    },
    {
      name: 'terms',
      label: 'Terms and Conditions',
      type: 'checkbox',
      checkboxLabel: 'I agree to the terms and conditions',
      required: true,
    } as CheckboxFieldConfig,
  ];

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (formValues: Record<string, any>) => {
    console.log('Form submitted:', formValues);
    // Validate and submit
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create Account</h2>
      <FormGenerator
        fields={fields}
        values={values}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Create Account"
      />
    </div>
  );
}

/**
 * Validation helper
 */
export function validateField(config: FieldConfig, value: any): string | undefined {
  const { required, validation } = config;

  // Required check
  if (required && !value) {
    return `${config.label} is required`;
  }

  if (!validation || !value) {
    return undefined;
  }

  // Min/Max for numbers
  if (typeof value === 'number') {
    if (validation.min !== undefined && value < validation.min) {
      return `${config.label} must be at least ${validation.min}`;
    }
    if (validation.max !== undefined && value > validation.max) {
      return `${config.label} must be at most ${validation.max}`;
    }
  }

  // MinLength/MaxLength for strings
  if (typeof value === 'string') {
    if (validation.minLength && value.length < validation.minLength) {
      return `${config.label} must be at least ${validation.minLength} characters`;
    }
    if (validation.maxLength && value.length > validation.maxLength) {
      return `${config.label} must be at most ${validation.maxLength} characters`;
    }
    if (validation.pattern && !validation.pattern.test(value)) {
      return `${config.label} format is invalid`;
    }
  }

  // Custom validation
  if (validation.custom) {
    return validation.custom(value);
  }

  return undefined;
}
