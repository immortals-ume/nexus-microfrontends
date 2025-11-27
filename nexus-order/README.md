# Nexus Order Microfrontend

Order management microfrontend for the Nexus e-commerce platform. Handles order history, order details, and tracking information.

## Features

- **Order History**: Display list of all customer orders with status indicators
- **Order Details**: Full order information including items, shipping address, and payment method
- **Order Status**: Visual indicators for order status (pending, processing, shipped, delivered, cancelled, refunded)
- **Tracking Information**: Display shipping tracking numbers and links
- **React Query Integration**: Efficient data fetching with caching and automatic refetching
- **Module Federation**: Exposes components for use in host application

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Query (TanStack Query)
- Axios
- Zustand (shared state)
- Module Federation

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5176`

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Exposed Components

This microfrontend exposes the following components via Module Federation:

- `./OrderHistory` - Order history list component
- `./OrderDetail` - Order detail page component

## Usage in Host Application

```typescript
import { lazy } from 'react';

const OrderHistory = lazy(() => import('order/OrderHistory'));
const OrderDetail = lazy(() => import('order/OrderDetail'));

// Use in your application
<OrderHistory userId="user-123" onOrderClick={handleOrderClick} />
<OrderDetail orderId="order-456" onBack={handleBack} />
```

## Components

### OrderHistory
Displays a list of all orders for a user with order cards showing:
- Order number and date
- Order status badge
- Preview of order items
- Total amount
- Click to view details

### OrderDetail
Shows complete order information including:
- Order number, date, and status
- Tracking information (if available)
- All order items with images and prices
- Shipping address
- Payment method
- Order summary with subtotal, tax, shipping, and total

### OrderCard
Summary card component for individual orders in the list.

### OrderStatus
Visual status indicator with icon and color coding for different order statuses.

### TrackingInfo
Displays shipping tracking number and link to carrier tracking page.

## API Integration

The microfrontend uses mock data for development. In production, it will integrate with the Order Service backend via the OrderServiceClient.

### Environment Variables

Create a `.env` file:

```
VITE_ORDER_SERVICE_URL=http://localhost:3002/api
```

## Requirements Validation

This microfrontend validates the following requirements:

- **8.1**: Display order history with all past orders, order numbers, dates, and totals
- **8.2**: Display detailed order information including items, shipping address, and status
- **8.3**: Update order display when status changes
- **8.4**: Display message when no orders exist
- **8.5**: Display tracking information

## Testing

```bash
npm run test
```

## Port Configuration

- Development: `5176`
- Preview: `5176`

## License

Private - Nexus E-commerce Platform
