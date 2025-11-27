# Component Patterns Documentation

This directory contains reusable component patterns for the Nexus e-commerce application. Each pattern solves specific problems and provides a structured approach to building components.

## Table of Contents

1. [Container/Presenter Pattern](#containerpresenter-pattern)
2. [Render Props Pattern](#render-props-pattern)
3. [Factory Pattern](#factory-pattern)
4. [State Reducer Pattern](#state-reducer-pattern)
5. [Higher-Order Components (HOCs)](#higher-order-components)
6. [Custom Hooks](#custom-hooks)

---

## Container/Presenter Pattern

**File:** `ContainerPresenter.tsx`

### Purpose
Separates data fetching and business logic (Container) from presentation and UI rendering (Presenter).

### Benefits
- Clear separation of concerns
- Easier testing (presenters are pure components)
- Reusable presenters with different data sources
- Predictable data flow

### When to Use
- Components that fetch data from APIs
- Components with complex business logic
- When you want to test UI separately from logic
- When multiple containers might use the same presenter

### Example

```tsx
// Presenter - Pure UI component
export function ProductListPresenter({ products, onAddToCart }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

// Container - Handles data and logic
export function ProductListContainer() {
  const { data: products } = useQuery(['products'], fetchProducts);
  const handleAddToCart = (productId) => { /* logic */ };
  
  return (
    <ProductListPresenter 
      products={products}
      onAddToCart={handleAddToCart}
    />
  );
}
```

---

## Render Props Pattern

**File:** `RenderProps.tsx`

### Purpose
Allows components to share code using a prop whose value is a function. The component calls this function instead of implementing its own render logic.

### Benefits
- Flexible composition
- Reusable logic with custom rendering
- Inversion of control
- Type-safe with TypeScript

### When to Use
- When you need flexible rendering
- Building reusable data fetching components
- Creating generic list/table components
- When HOCs feel too rigid

### Example

```tsx
// Generic DataTable with render props
<DataTable
  data={products}
  columns={columns}
  renderCell={(product, column) => {
    if (column.key === 'price') {
      return <span className="font-bold">${product.price}</span>;
    }
    return product[column.key];
  }}
  renderEmpty={() => <EmptyState />}
/>

// Generic List with render props
<List
  items={products}
  renderItem={(product) => (
    <ProductCard product={product} />
  )}
  renderLoading={() => <Skeleton />}
  renderEmpty={() => <EmptyState />}
/>
```

---

## Factory Pattern

**File:** `FormFieldFactory.tsx`

### Purpose
Creates form fields dynamically based on configuration. Useful for generating forms from schemas or API responses.

### Benefits
- DRY (Don't Repeat Yourself)
- Consistent form field styling
- Easy to add new field types
- Type-safe field generation
- Reduces boilerplate code

### When to Use
- Building dynamic forms
- Creating form builders
- When you have many similar forms
- API-driven form generation

### Example

```tsx
// Define form configuration
const fields: FieldConfig[] = [
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    validation: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  },
  {
    name: 'country',
    label: 'Country',
    type: 'select',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' }
    ]
  }
];

// Generate form automatically
<FormGenerator
  fields={fields}
  values={values}
  errors={errors}
  onChange={handleChange}
  onSubmit={handleSubmit}
/>
```

---

## State Reducer Pattern

**File:** `StateReducer.tsx`

### Purpose
Uses `useReducer` for managing complex state logic. Particularly useful for forms with multiple fields, validation, and submission states.

### Benefits
- Predictable state updates
- Easier to test
- Better for complex state logic
- Single source of truth
- Clear action types

### When to Use
- Complex forms with validation
- Multi-step wizards
- Components with many state transitions
- When state updates depend on previous state

### Example

```tsx
// Use the form state hook
const form = useFormState({
  initialValues: {
    email: '',
    password: ''
  },
  validate: (values) => {
    const errors = {};
    if (!values.email) errors.email = 'Required';
    return errors;
  },
  onSubmit: async (values) => {
    await api.login(values);
  }
});

// Use in component
<form onSubmit={form.handleSubmit}>
  <input
    value={form.values.email}
    onChange={(e) => form.setFieldValue('email', e.target.value)}
    onBlur={() => form.setFieldTouched('email')}
  />
  {form.touched.email && form.errors.email && (
    <span>{form.errors.email}</span>
  )}
</form>
```

---

## Higher-Order Components

**Directory:** `../hoc/`

### Available HOCs

#### `withAuth`
Wraps a component with authentication check. Redirects to login if not authenticated.

```tsx
const ProtectedDashboard = withAuth(Dashboard);
const AdminPanel = withAuth(AdminPanel, { requiredRole: 'admin' });
```

#### `withLoading`
Shows a loading state while data is being fetched.

```tsx
const ProductListWithLoading = withLoading(ProductList);
<ProductListWithLoading isLoading={isLoading} products={products} />
```

#### `withErrorBoundary`
Catches JavaScript errors anywhere in the child component tree.

```tsx
const SafeProductList = withErrorBoundary(ProductList);
const SafeDashboard = withErrorBoundary(Dashboard, CustomErrorFallback);
```

---

## Custom Hooks

**Directory:** `../../hooks/`

### Available Hooks

#### `useMediaQuery`
Detects media query matches for responsive design.

```tsx
const isMobile = useIsMobile();
const isDesktop = useIsDesktop();
const matches = useMediaQuery('(min-width: 768px)');
```

#### `useDebounce`
Debounces a value or callback function.

```tsx
const debouncedSearch = useDebounce(searchTerm, 500);
const debouncedCallback = useDebouncedCallback(handleSearch, 500);
```

#### `useLocalStorage`
Manages state synchronized with localStorage.

```tsx
const [cart, setCart, removeCart] = useLocalStorage('cart', []);
```

#### `useCommandManager`
Implements undo/redo functionality using the Command pattern.

```tsx
const { execute, undo, redo, canUndo, canRedo } = useCommandManager();

// Execute a command
execute(new AddItemCommand(item, items, setItems));

// Undo/Redo
if (canUndo) undo();
if (canRedo) redo();
```

---

## Best Practices

### 1. Choose the Right Pattern

- **Container/Presenter**: Use for components that fetch data
- **Render Props**: Use when you need flexible rendering
- **Factory**: Use for generating similar components
- **State Reducer**: Use for complex state management
- **HOCs**: Use for cross-cutting concerns (auth, loading, errors)

### 2. Composition Over Inheritance

Prefer composing patterns together rather than creating deep inheritance hierarchies.

```tsx
// Good: Compose patterns
const SafeProductList = withErrorBoundary(
  withLoading(
    withAuth(ProductListContainer)
  )
);

// Better: Use hooks and render props for more flexibility
function ProductList() {
  const auth = useAuth();
  const { data, isLoading } = useQuery(['products'], fetchProducts);
  
  if (!auth.isAuthenticated) return <Redirect to="/login" />;
  if (isLoading) return <Loading />;
  
  return <ProductListPresenter products={data} />;
}
```

### 3. Keep Components Focused

Each component should have a single responsibility. Use patterns to separate concerns.

### 4. Type Safety

Always use TypeScript types for pattern props and state.

```tsx
interface ContainerProps {
  userId: string;
}

interface PresenterProps {
  user: User;
  onEdit: (user: User) => void;
}
```

### 5. Testing

Patterns make testing easier:

- **Presenters**: Test UI without mocking APIs
- **Containers**: Test logic without rendering
- **Reducers**: Test state transitions in isolation
- **Hooks**: Test with `@testing-library/react-hooks`

---

## Examples

See the example components in each pattern file:

- `ProductListExample` - Container/Presenter pattern
- `ProductTableExample` - Render Props pattern
- `UserRegistrationFormExample` - Factory pattern
- `LoginFormExample` - State Reducer pattern

---

## Contributing

When adding new patterns:

1. Create a new file in this directory
2. Document the pattern with JSDoc comments
3. Provide at least one complete example
4. Add exports to `index.ts`
5. Update this README

---

## Resources

- [React Patterns](https://reactpatterns.com/)
- [Advanced React Patterns](https://kentcdodds.com/blog/advanced-react-patterns)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
