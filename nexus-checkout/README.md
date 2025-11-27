# Nexus Checkout Microfrontend

The checkout microfrontend handles the complete checkout flow for the Nexus e-commerce platform.

## Features

- **Multi-step Checkout Wizard**: Shipping → Payment → Review flow
- **Form Validation**: Zod schema validation for all forms
- **Address Management**: Shipping and billing address forms
- **Payment Processing**: Support for credit cards, debit cards, and PayPal
- **Order Review**: Complete order summary before placing order
- **Order Confirmation**: Success page with order details
- **Progress Indicator**: Visual step indicator showing checkout progress

## Components

### CheckoutWizard
Main orchestrator component that manages the checkout flow state and coordinates between steps.

### CheckoutProgress
Visual progress indicator showing current step and completed steps.

### ShippingForm
Form for collecting shipping address with validation.

### PaymentForm
Form for collecting payment method details with card validation.

### OrderReview
Summary page showing all order details before final submission.

### OrderConfirmation
Success page displayed after order is placed.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Module Federation

This microfrontend exposes the following components:

- `./CheckoutWizard` - Main checkout wizard component
- `./CheckoutProgress` - Progress indicator component

## Integration

```typescript
import { CheckoutWizard } from 'checkout/CheckoutWizard';

<CheckoutWizard
  useStore={useStore}
  onOrderComplete={(order) => console.log('Order placed:', order)}
  onContinueShopping={() => navigate('/')}
  onViewOrder={(orderId) => navigate(`/orders/${orderId}`)}
/>
```

## Requirements

This microfrontend integrates with:
- Order Service (order-service backend)
- Payment Service (payment-service backend)
- Zustand store for cart and auth state
- Event bus for order created events

## Port

Runs on port **5175** in development mode.
