# Nexus Auth Microfrontend

Authentication microfrontend for the Nexus e-commerce platform.

## Features

- **LoginForm**: User login with email and password
- **RegisterForm**: New user registration with validation
- **ForgotPasswordForm**: Password reset request flow
- **React Query Integration**: Efficient data fetching and caching
- **Zustand Integration**: Shared state management with host application
- **Event Bus**: Cross-microfrontend communication

## Components Exposed

This microfrontend exposes the following components via Module Federation:

- `./LoginForm` - Login form component
- `./RegisterForm` - Registration form component
- `./ForgotPasswordForm` - Password reset form component
- `./AuthApp` - Complete auth application

## Development

```bash
# Install dependencies
npm install

# Start development server (port 5178)
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run tests in watch mode
npm test
```

## Integration with Host

The auth microfrontend integrates with the host application through:

1. **Zustand Store**: Accesses `window.useStore` for auth state management
2. **Event Bus**: Publishes auth events via `window.eventBus`
3. **Module Federation**: Exposes components for remote loading

### Usage in Host

```typescript
// Load LoginForm from auth microfrontend
import LoginForm from 'auth/LoginForm';

function LoginPage() {
  return <LoginForm onSuccess={() => navigate('/dashboard')} />;
}
```

## Environment Variables

- `VITE_AUTH_SERVICE_URL`: Backend auth service URL (default: http://localhost:8085/api/auth)

## Architecture

The auth microfrontend follows these patterns:

- **React Query Mutations**: For login, register, and password reset operations
- **Form Validation**: Client-side validation with error messages
- **State Management**: Updates Zustand store on successful authentication
- **Event Broadcasting**: Emits auth events for other microfrontends
- **Error Handling**: Comprehensive error handling with user feedback

## Requirements Validated

This microfrontend validates the following requirements:

- **6.1**: User login with credentials
- **6.2**: User registration with account creation
- **6.3**: User logout functionality
- **6.4**: Session restoration from stored tokens
- **6.6**: Token refresh mechanism
