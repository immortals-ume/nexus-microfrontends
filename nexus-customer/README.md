# Nexus Customer Microfrontend

Customer profile management microfrontend for the Nexus e-commerce platform.

## Features

- User profile management
- Address book (add, edit, delete addresses)
- Payment methods management
- Profile update with validation
- Integration with customer-service backend

## Port

This microfrontend runs on port **5177**.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run tests once
npm run test:run
```

## Module Federation

This microfrontend exposes the following components:

- `./App` - Main application component
- `./ProfilePage` - User profile page
- `./AddressBook` - Address management component
- `./PaymentMethods` - Payment methods management component

## Integration

The customer microfrontend integrates with:

- **CustomerServiceClient** - API client for customer-service backend
- **Zustand Store** - Global state management (customer slice)
- **React Query** - Data fetching and caching
- **Event Bus** - Microfrontend communication

## Backend Service

Connects to: `customer-service` (default: http://localhost:8083/api/customers)

## Requirements

Implements requirements:
- 6.1: User profile management
- 6.2: Address management
- 6.3: Payment methods management
