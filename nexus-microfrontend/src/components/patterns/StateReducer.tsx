/**
 * State Reducer Pattern for Complex Forms
 * 
 * This pattern uses useReducer for managing complex state logic
 * Particularly useful for forms with multiple fields and validation
 * 
 * Benefits:
 * - Predictable state updates
 * - Easier to test
 * - Better for complex state logic
 * - Single source of truth
 */

import React, { useReducer, Reducer } from 'react';

/**
 * Example 1: Complex Form State with Reducer
 */

// Form state type
export interface FormState<T = Record<string, any>> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  submitCount: number;
}

// Form actions
export type FormAction<T = Record<string, any>> =
  | { type: 'SET_FIELD_VALUE'; field: keyof T; value: any }
  | { type: 'SET_FIELD_ERROR'; field: keyof T; error: string }
  | { type: 'CLEAR_FIELD_ERROR'; field: keyof T }
  | { type: 'SET_FIELD_TOUCHED'; field: keyof T }
  | { type: 'SET_ERRORS'; errors: Record<string, string> }
  | { type: 'SET_VALUES'; values: T }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SUBMIT_ATTEMPT' }
  | { type: 'RESET'; initialValues: T };

// Form reducer
export function formReducer<T = Record<string, any>>(
  state: FormState<T>,
  action: FormAction<T>
): FormState<T> {
  switch (action.type) {
    case 'SET_FIELD_VALUE':
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value,
        },
      };

    case 'SET_FIELD_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error,
        },
        isValid: false,
      };

    case 'CLEAR_FIELD_ERROR': {
      const newErrors = { ...state.errors };
      delete newErrors[action.field as string];
      return {
        ...state,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0,
      };
    }

    case 'SET_FIELD_TOUCHED':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.field]: true,
        },
      };

    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
        isValid: Object.keys(action.errors).length === 0,
      };

    case 'SET_VALUES':
      return {
        ...state,
        values: action.values,
      };

    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting,
      };

    case 'SUBMIT_ATTEMPT':
      return {
        ...state,
        submitCount: state.submitCount + 1,
        touched: Object.keys(state.values).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        ),
      };

    case 'RESET':
      return {
        values: action.initialValues,
        errors: {},
        touched: {},
        isSubmitting: false,
        isValid: true,
        submitCount: 0,
      };

    default:
      return state;
  }
}

/**
 * Custom hook for form state management
 */
export interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Record<string, string>;
  onSubmit: (values: T) => Promise<void> | void;
}

export function useFormState<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>) {
  const [state, dispatch] = useReducer<Reducer<FormState<T>, FormAction<T>>>(
    formReducer,
    {
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true,
      submitCount: 0,
    }
  );

  // Set field value
  const setFieldValue = (field: keyof T, value: any) => {
    dispatch({ type: 'SET_FIELD_VALUE', field, value });
    
    // Clear error when user starts typing
    if (state.errors[field as string]) {
      dispatch({ type: 'CLEAR_FIELD_ERROR', field });
    }
  };

  // Set field touched
  const setFieldTouched = (field: keyof T) => {
    dispatch({ type: 'SET_FIELD_TOUCHED', field });
    
    // Validate field on blur if validation function provided
    if (validate) {
      const errors = validate(state.values);
      if (errors[field as string]) {
        dispatch({ type: 'SET_FIELD_ERROR', field, error: errors[field as string] });
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    dispatch({ type: 'SUBMIT_ATTEMPT' });

    // Validate all fields
    if (validate) {
      const errors = validate(state.values);
      if (Object.keys(errors).length > 0) {
        dispatch({ type: 'SET_ERRORS', errors });
        return;
      }
    }

    // Submit form
    dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });
    try {
      await onSubmit(state.values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
    }
  };

  // Reset form
  const reset = () => {
    dispatch({ type: 'RESET', initialValues });
  };

  // Set multiple values
  const setValues = (values: T) => {
    dispatch({ type: 'SET_VALUES', values });
  };

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    isValid: state.isValid,
    submitCount: state.submitCount,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    reset,
    setValues,
  };
}

/**
 * Example: Login Form with State Reducer
 */
interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function LoginFormExample() {
  const form = useFormState<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = 'Invalid email address';
      }

      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }

      return errors;
    },
    onSubmit: async (values) => {
      console.log('Logging in with:', values);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Login successful!');
    },
  });

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={form.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.values.email}
            onChange={(e) => form.setFieldValue('email', e.target.value)}
            onBlur={() => form.setFieldTouched('email')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
              form.touched.email && form.errors.email
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />
          {form.touched.email && form.errors.email && (
            <p className="text-sm text-red-600 mt-1">{form.errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={form.values.password}
            onChange={(e) => form.setFieldValue('password', e.target.value)}
            onBlur={() => form.setFieldTouched('password')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
              form.touched.password && form.errors.password
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />
          {form.touched.password && form.errors.password && (
            <p className="text-sm text-red-600 mt-1">{form.errors.password}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            checked={form.values.rememberMe}
            onChange={(e) => form.setFieldValue('rememberMe', e.target.checked)}
            className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          disabled={form.isSubmitting}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {form.isSubmitting ? 'Logging in...' : 'Login'}
        </button>

        <button
          type="button"
          onClick={form.reset}
          className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Reset
        </button>
      </form>

      {/* Debug info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Form State:</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(
            {
              values: form.values,
              errors: form.errors,
              touched: form.touched,
              isValid: form.isValid,
              submitCount: form.submitCount,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}

/**
 * Example 2: Multi-Step Form with Reducer
 */

interface MultiStepFormState {
  currentStep: number;
  steps: string[];
  data: Record<string, any>;
  completedSteps: Set<number>;
}

type MultiStepFormAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; step: number }
  | { type: 'UPDATE_STEP_DATA'; step: number; data: Record<string, any> }
  | { type: 'COMPLETE_STEP'; step: number }
  | { type: 'RESET' };

function multiStepFormReducer(
  state: MultiStepFormState,
  action: MultiStepFormAction
): MultiStepFormState {
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.steps.length - 1),
      };

    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      };

    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: action.step,
      };

    case 'UPDATE_STEP_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          [`step${action.step}`]: action.data,
        },
      };

    case 'COMPLETE_STEP': {
      const newCompletedSteps = new Set(state.completedSteps);
      newCompletedSteps.add(action.step);
      return {
        ...state,
        completedSteps: newCompletedSteps,
      };
    }

    case 'RESET':
      return {
        currentStep: 0,
        steps: state.steps,
        data: {},
        completedSteps: new Set(),
      };

    default:
      return state;
  }
}

export function useMultiStepForm(steps: string[]) {
  const [state, dispatch] = useReducer(multiStepFormReducer, {
    currentStep: 0,
    steps,
    data: {},
    completedSteps: new Set(),
  });

  const nextStep = () => dispatch({ type: 'NEXT_STEP' });
  const prevStep = () => dispatch({ type: 'PREV_STEP' });
  const goToStep = (step: number) => dispatch({ type: 'GO_TO_STEP', step });
  const updateStepData = (step: number, data: Record<string, any>) =>
    dispatch({ type: 'UPDATE_STEP_DATA', step, data });
  const completeStep = (step: number) => dispatch({ type: 'COMPLETE_STEP', step });
  const reset = () => dispatch({ type: 'RESET' });

  const isFirstStep = state.currentStep === 0;
  const isLastStep = state.currentStep === state.steps.length - 1;
  const progress = ((state.currentStep + 1) / state.steps.length) * 100;

  return {
    currentStep: state.currentStep,
    steps: state.steps,
    data: state.data,
    completedSteps: state.completedSteps,
    isFirstStep,
    isLastStep,
    progress,
    nextStep,
    prevStep,
    goToStep,
    updateStepData,
    completeStep,
    reset,
  };
}
