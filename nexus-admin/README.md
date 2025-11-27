# Nexus Admin Microfrontend

Admin dashboard microfrontend for managing products, orders, customers, and analytics.

## Features

### Dashboard
- Key metrics overview (revenue, orders, customers, AOV)
- Revenue trend chart
- Top products bar chart
- Real-time statistics with change indicators

### Product Management
- Product list with search and filters
- Product CRUD operations
- Stock level indicators
- Category management
- Image upload support
- Inventory tracking

### Order Management
- Order list with search and status filters
- Order status updates
- Order details view
- Customer information
- Payment and shipping details

### Analytics
- Sales charts and reports
- Revenue tracking
- Customer analytics
- Product performance metrics

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Charts and data visualization
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **Axios** - HTTP client
- **Module Federation** - Microfrontend architecture

## Development

```bash
# Install dependencies
npm install

# Start development server (port 5179)
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run tests in watch mode
npm run test:run
```

## Module Federation

This microfrontend exposes the following components:

- `./App` - Main admin application
- `./Dashboard` - Dashboard page
- `./ProductManagement` - Product management page
- `./OrderManagement` - Order management page

## Integration

The admin microfrontend integrates with the following backend services:

- **product-service** - Product catalog management
- **order-service** - Order management
- **customer-service** - Customer management
- **analytics-service** - Analytics and reporting

## Port Configuration

- Development: `5179`
- Preview: `5179`

## Shared Dependencies

The following dependencies are shared with the host application:

- react
- react-dom
- react-router-dom
- zustand
- @tanstack/react-query
- axios
