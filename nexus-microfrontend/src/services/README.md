# API Services

This directory contains service clients for all backend microservices. Each service client is responsible for API communication with its corresponding backend service.

## Architecture

The service layer follows these principles:

1. **One client per backend service**: Each backend microservice has a corresponding frontend service client
2. **Singleton pattern**: ApiServiceFactory ensures only one instance of each client exists
3. **Consistent error handling**: All clients handle errors uniformly
4. **Automatic authentication**: Clients automatically include auth tokens (except AuthServiceClient)
5. **Type safety**: All requests and responses are fully typed

## Service Clients

### ProductServiceClient
- **Backend**: product-service (port 8081)
- **Purpose**: Product catalog management
- **Endpoints**: CRUD operations, search, filtering
- **Auth**: Required

### OrderServiceClient
- **Backend**: order-service (port 8082)
- **Purpose**: Order management and cart operations
- **Endpoints**: Orders CRUD, cart sync, status updates
- **Auth**: Required
- **Timeout**: 15 seconds (longer for order processing)

### CustomerServiceClient
- **Backend**: customer-service (port 8083)
- **Purpose**: Customer profile and address management
- **Endpoints**: Profile CRUD, addresses CRUD
- **Auth**: Required

### PaymentServiceClient
- **Backend**: payment-service (port 8084)
- **Purpose**: Payment processing
- **Endpoints**: Payment intents, process payments, payment methods
- **Auth**: Required
- **Timeout**: 20 seconds (longer for payment processing)

### AuthServiceClient
- **Backend**: auth-service (port 8085)
- **Purpose**: Authentication and authorization
- **Endpoints**: Login, register, logout, token refresh
- **Auth**: Not required (this service provides tokens)

### NotificationServiceClient
- **Backend**: notification-service (port 8086)
- **Purpose**: User notifications
- **Endpoints**: Get notifications, mark as read, push subscriptions
- **Auth**: Required
- **Timeout**: 5 seconds (fast responses expected)

## Usage

### Basic Usage

```typescript
import { ApiServiceFactory } from '@/services';

// Get a service instance
const productService = ApiServiceFactory.getProductService();

// Make API calls
const products = await productService.getAll({ page: 1, limit: 20 });
const product = await productService.getById('123');
```

### With React Query

```typescript
import { useQuery } from '@tanstack/react-query';
import { ApiServiceFactory } from '@/services';

function ProductList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => ApiServiceFactory.getProductService().getAll(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### With Zustand Store

```typescript
import { ApiServiceFactory } from '@/services';

// In a Zustand slice
const createAuthSlice = (set, get) => ({
  login: async (credentials) => {
    set((state) => ({ auth: { ...state.auth, isLoading: true } }));
    try {
      const authService = ApiServiceFactory.getAuthService();
      const response = await authService.login(credentials);
      
      set((state) => ({
        auth: {
          ...state.auth,
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
        },
      }));
    } catch (error) {
      set((state) => ({
        auth: {
          ...state.auth,
          isLoading: false,
          error: error.message,
        },
      }));
    }
  },
});
```

## Request Interceptors

All service clients (except AuthServiceClient) automatically add authentication tokens to requests:

```typescript
// Automatically added to all requests
headers: {
  'Authorization': 'Bearer <token>'
}
```

The token is retrieved from localStorage where Zustand persists it.

## Response Interceptors

All service clients handle common HTTP errors:

- **401 Unauthorized**: Redirects to login page
- **403 Forbidden**: Logs permission error
- **404 Not Found**: Logs resource not found
- **422 Validation Error**: Logs validation details
- **500+ Server Error**: Logs server error
- **Network Error**: Logs connection error
- **Timeout**: Logs timeout error

## Error Handling

Errors are propagated to the caller and should be handled at the component level:

```typescript
try {
  const product = await productService.getById('123');
} catch (error) {
  if (error.response?.status === 404) {
    // Handle not found
  } else if (error.response?.status === 422) {
    // Handle validation error
  } else {
    // Handle generic error
  }
}
```

## Environment Variables

Each service client uses environment variables for configuration:

```env
VITE_PRODUCT_SERVICE_URL=http://localhost:8081/api/products
VITE_ORDER_SERVICE_URL=http://localhost:8082/api/orders
VITE_CUSTOMER_SERVICE_URL=http://localhost:8083/api/customers
VITE_PAYMENT_SERVICE_URL=http://localhost:8084/api/payments
VITE_AUTH_SERVICE_URL=http://localhost:8085/api/auth
VITE_NOTIFICATION_SERVICE_URL=http://localhost:8086/api/notifications
```

## Testing

Service clients can be tested by mocking axios or using MSW (Mock Service Worker):

```typescript
import { ApiServiceFactory } from '@/services';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('http://localhost:8081/api/products', (req, res, ctx) => {
    return res(ctx.json({ data: [], total: 0 }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('fetches products', async () => {
  const productService = ApiServiceFactory.getProductService();
  const result = await productService.getAll();
  expect(result.data).toEqual([]);
});
```

## Singleton Pattern

The ApiServiceFactory ensures only one instance of each service exists:

```typescript
// These return the same instance
const service1 = ApiServiceFactory.getProductService();
const service2 = ApiServiceFactory.getProductService();

console.log(service1 === service2); // true
```

This is important for:
- Consistent interceptor behavior across the application
- Efficient memory usage
- Shared request/response handling

## Adding New Services

To add a new service client:

1. Create a new file: `NewServiceClient.ts`
2. Implement the client class with interceptors
3. Add to `ApiServiceFactory.ts`
4. Export from `index.ts`
5. Add environment variable
6. Update this README

Example:

```typescript
// AnalyticsServiceClient.ts
export class AnalyticsServiceClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_ANALYTICS_SERVICE_URL,
      timeout: 10000,
    });
    this.setupInterceptors();
  }

  // ... implement methods
}
```
