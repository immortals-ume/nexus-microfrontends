/**
 * Component Patterns for Nexus E-commerce Application
 * 
 * This module exports all component patterns and utilities used throughout the application.
 * Each pattern is documented with examples and use cases.
 */

// Container/Presenter Pattern
export {
  ProductListPresenter,
  ProductListContainer,
  UserProfilePresenter,
  UserProfileContainer,
} from './ContainerPresenter';

// Render Props Pattern
export {
  DataTable,
  List,
  DataFetcher,
  Toggle,
  ProductTableExample,
  ProductListExample,
  UserDataExample,
  ToggleExample,
} from './RenderProps';

// Factory Pattern
export {
  createFormField,
  FormGenerator,
  UserRegistrationFormExample,
  validateField,
  type FieldType,
  type FieldConfig,
  type BaseFieldConfig,
  type SelectFieldConfig,
  type CheckboxFieldConfig,
  type RadioFieldConfig,
  type FormFieldProps,
  type FormGeneratorProps,
} from './FormFieldFactory';

// State Reducer Pattern
export {
  formReducer,
  useFormState,
  useMultiStepForm,
  LoginFormExample,
  type FormState,
  type FormAction,
  type UseFormOptions,
} from './StateReducer';
