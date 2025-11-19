# Implementation Plan

- [x] 1. Set up shared infrastructure and dependencies
  - Install core dependencies (Zustand, React Query, Tailwind CSS, Axios) in host application
  - Configure Tailwind CSS with custom theme and design tokens
  - Set up shared UI component library structure
  - Create event bus for microfrontend communication
  - Set up testing infrastructure (Vitest, React Testing Library, fast-check)
  - _Requirements: 1.1, 4.1, 5.1, 9.1_

- [ ]* 1.1 Write property test for event bus
  - **Property 26: Event bus broadcasting**
  - **Validates: Requirements 11.1, 11.2, 11.3**

- [x] 2. Create Zustand store with service-aligned slices
  - Implement auth slice with login, logout, register, token refresh
  - Implement products slice with filters and selected product state
  - Implement cart slice with add, remove, update quantity, clear operations
  - Implement orders slice with order list and selected order
  - Implement customer slice with profile, addresses, payment methods
  - Implement payment slice with payment intent and selected method
  - Implement notifications slice with unread count and mark as read
  - Implement UI slice with sidebar, cart drawer, theme state
  - Configure persistence middleware for auth, cart, and theme
  - _Requirements: 1.1, 1.2, 1.3_

- [ ]* 2.1 Write property test for reactive state synchronization
  - **Property 1: Reactive state synchronization across microfrontends**
  - **Validates: Requirements 1.2, 1.3**

- [ ]* 2.2 Write property test for cart persistence
  - **Property 2: Cart persistence round-trip**
  - **Validates: Requirements 1.4, 3.6**

- [ ]* 2.3 Write property test for authentication state propagation
  - **Property 3: Authentication state propagation**
  - **Validates: Requirements 1.5**

- [x] 3. Create service-specific Axios clients
  - Implement ProductServiceClient with interceptors
  - Implement OrderServiceClient with interceptors
  - Implement CustomerServiceClient with interceptors
  - Implement PaymentServiceClient with interceptors
  - Implement AuthServiceClient (no auth interceptor needed)
  - Implement NotificationServiceClient with interceptors
  - Create ApiServiceFactory for singleton instances
  - Configure request/response interceptors for auth tokens and error handling
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ]* 3.1 Write property test for authentication header inclusion
  - **Property 14: Authentication header inclusion**
  - **Validates: Requirements 5.2**

- [ ]* 3.2 Write property test for network error handling
  - **Property 15: Network error handling**
  - **Validates: Requirements 5.4**

- [x] 4. Configure React Query client
  - Set up QueryClient with default options (stale time, cache time, retry logic)
  - Create query key factory for products, orders, cart
  - Configure exponential backoff retry strategy
  - Set up refetch on window focus and reconnect
  - _Requirements: 4.1, 4.2, 4.3, 4.5, 4.6_

- [ ]* 4.1 Write property test for query cache TTL
  - **Property 11: Query cache TTL behavior**
  - **Validates: Requirements 4.2**

- [ ]* 4.2 Write property test for mutation invalidation
  - **Property 12: Mutation invalidation**
  - **Validates: Requirements 4.4**

- [ ]* 4.3 Write property test for request retry
  - **Property 13: Request retry with exponential backoff**
  - **Validates: Requirements 4.5**

- [x] 5. Build shared UI component library
  - Create Button component with variants (primary, secondary, outline, ghost)
  - Create Input, Select, Checkbox, Radio, Switch, Textarea form components
  - Create FormField wrapper with label, error, and helper text
  - Create Badge, Avatar, Card, Tabs, Accordion, Tooltip, Popover components
  - Create Table, Pagination, Skeleton, Spinner, Progress components
  - Create Alert, Toast, Modal, Dropdown components
  - Create Container, Grid, Flex, Stack layout components
  - Style all components with Tailwind CSS
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ]* 5.1 Write unit tests for shared UI components
  - Test Button variants and click handlers
  - Test form components with validation states
  - Test responsive layout components

- [ ] 6. Update host application with shared providers
  - Wrap app with QueryClientProvider
  - Wrap app with Zustand StoreProvider
  - Create AuthProvider for authentication context
  - Create ThemeProvider for theme management
  - Update Header with cart icon, user menu, search bar
  - Create ProtectedRoute component for route guards
  - Update Module Federation config to share Zustand, React Query, Axios
  - _Requirements: 1.1, 4.1, 6.5_

- [ ]* 6.1 Write property test for protected route guard
  - **Property 19: Protected route authentication guard**
  - **Validates: Requirements 6.5**

- [x] 7. Checkpoint - Ensure all tests pass (move eveythign to single UI package in nexus composite folder )
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Create Auth Microfrontend (auth-mfe)
  - Set up new Vite project with Module Federation
  - Create LoginForm component with email and password fields
  - Create RegisterForm component with user details
  - Create ForgotPasswordForm component
  - Implement login mutation with React Query
  - Implement register mutation with React Query
  - Integrate with AuthServiceClient
  - Update Zustand auth slice on successful login/register
  - Emit auth events through event bus
  - Configure Module Federation to expose Auth components
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.6_

- [ ]* 8.1 Write property test for session restoration
  - **Property 18: Session restoration round-trip**
  - **Validates: Requirements 6.4**

- [ ]* 8.2 Write unit tests for auth forms
  - Test login form validation
  - Test register form validation
  - Test password reset flow

- [ ] 9. Create Product Microfrontend (product-mfe)
  - Set up new Vite project with Module Federation
  - Create ProductGrid component with responsive grid layout
  - Create ProductCard component with image, name, price, rating
  - Create ProductDetail page with image gallery, description, reviews
  - Create SearchBar component with autocomplete
  - Create FilterSidebar with category, price range, sort options
  - Implement useProducts query hook with filters
  - Implement useProductDetail query hook
  - Integrate with ProductServiceClient
  - Configure Module Federation to expose Product components
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ]* 9.1 Write property test for product catalog completeness
  - **Property 4: Product catalog completeness**
  - **Validates: Requirements 2.1**

- [ ]* 9.2 Write property test for search filter correctness
  - **Property 5: Search filter correctness**
  - **Validates: Requirements 2.2, 15.1**

- [ ]* 9.3 Write property test for category filter correctness
  - **Property 6: Category filter correctness**
  - **Validates: Requirements 2.3**

- [ ]* 9.4 Write property test for sort order invariant
  - **Property 7: Sort order invariant**
  - **Validates: Requirements 2.4**

- [ ]* 9.5 Write property test for price range filter
  - **Property 36: Price range filter correctness**
  - **Validates: Requirements 15.2**

- [ ]* 9.6 Write property test for multiple filter AND logic
  - **Property 37: Multiple filter AND logic**
  - **Validates: Requirements 15.3**

- [ ]* 9.7 Write property test for lazy loading images
  - **Property 25: Lazy loading off-screen images**
  - **Validates: Requirements 10.2**

- [ ] 10. Create Cart Microfrontend (cart-mfe)
  - Set up new Vite project with Module Federation
  - Create CartDrawer slide-out component
  - Create CartIcon with item count badge
  - Create CartItem component with quantity controls
  - Create CartSummary with subtotal, tax, shipping, total
  - Create EmptyCart state component
  - Implement add to cart functionality with Zustand
  - Implement remove from cart functionality
  - Implement update quantity functionality
  - Implement cart calculations (subtotal, tax, shipping, total)
  - Persist cart to localStorage on changes
  - Emit cart events through event bus
  - Configure Module Federation to expose Cart components
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ]* 10.1 Write property test for cart calculations
  - **Property 8: Cart calculations maintain correctness**
  - **Validates: Requirements 3.1, 3.3**

- [ ]* 10.2 Write property test for cart item removal
  - **Property 9: Cart item removal**
  - **Validates: Requirements 3.4**

- [ ]* 10.3 Write property test for cart display completeness
  - **Property 10: Cart display completeness**
  - **Validates: Requirements 3.2**

- [ ] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Create Checkout Microfrontend (checkout-mfe)
  - Set up new Vite project with Module Federation
  - Create CheckoutWizard multi-step component
  - Create ShippingForm with address validation
  - Create PaymentForm with payment method selection
  - Create OrderReview component
  - Create OrderConfirmation success page
  - Create CheckoutProgress step indicator
  - Implement shipping form validation with Zod schema
  - Implement payment processing mutation
  - Integrate with OrderServiceClient and PaymentServiceClient
  - Create order on successful payment
  - Clear cart after successful order
  - Emit order created event
  - Configure Module Federation to expose Checkout components
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ]* 12.1 Write property test for shipping data validation
  - **Property 20: Shipping data validation**
  - **Validates: Requirements 7.2**

- [ ]* 12.2 Write unit tests for checkout flow
  - Test shipping form validation
  - Test payment form validation
  - Test order creation on successful payment
  - Test cart clearing after order

- [ ] 13. Create Order Microfrontend (order-mfe)
  - Set up new Vite project with Module Federation
  - Create OrderHistory list component
  - Create OrderCard summary component
  - Create OrderDetail page with full order information
  - Create OrderStatus visual indicator
  - Create TrackingInfo component
  - Implement useOrders query hook
  - Implement useOrderDetail query hook
  - Integrate with OrderServiceClient
  - Listen for order status change events
  - Configure Module Federation to expose Order components
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 13.1 Write property test for order history completeness
  - **Property 21: Order history completeness**
  - **Validates: Requirements 8.1**

- [ ]* 13.2 Write property test for order status updates
  - **Property 22: Order status updates**
  - **Validates: Requirements 8.3**

- [ ] 14. Create Customer Microfrontend (customer-mfe)
  - Set up new Vite project with Module Federation
  - Create ProfilePage with user information
  - Create AddressBook component for managing addresses
  - Create PaymentMethods component for managing payment methods
  - Create profile update form with validation
  - Implement useProfile query hook
  - Implement useAddresses query hook
  - Implement usePaymentMethods query hook
  - Implement update profile mutation
  - Implement add/update/delete address mutations
  - Integrate with CustomerServiceClient
  - Configure Module Federation to expose Customer components
  - _Requirements: 6.1, 6.2, 6.3_

- [ ]* 14.1 Write unit tests for customer profile
  - Test profile update form validation
  - Test address CRUD operations
  - Test payment method management

- [ ] 15. Create Admin Microfrontend (admin-mfe)
  - Set up new Vite project with Module Federation
  - Create AdminDashboard with metrics overview
  - Create ProductList table with search and filters
  - Create ProductForm for create/edit product
  - Create ProductImageUploader component
  - Create CategoryManager component
  - Create InventoryManager component
  - Create OrdersTable with search and filters
  - Create OrderDetailAdmin view
  - Create OrderStatusUpdater component
  - Create UsersTable component
  - Create UserDetail component
  - Create RoleManager component
  - Create AnalyticsDashboard with charts
  - Create SalesChart, RevenueChart, OrdersChart components
  - Implement product CRUD mutations with optimistic updates
  - Implement order management mutations
  - Implement customer management functionality
  - Integrate with ProductServiceClient, OrderServiceClient, CustomerServiceClient, AnalyticsService
  - Configure Module Federation to expose Admin components
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ]* 15.1 Write property test for product validation
  - **Property 32: Product validation on creation**
  - **Validates: Requirements 13.2**

- [ ]* 15.2 Write property test for optimistic updates
  - **Property 33: Optimistic product updates**
  - **Validates: Requirements 13.3**

- [ ]* 15.3 Write property test for product deletion
  - **Property 34: Product deletion with confirmation**
  - **Validates: Requirements 13.4**

- [ ]* 15.4 Write property test for analytics tracking
  - **Property 35: Analytics event tracking**
  - **Validates: Requirements 14.1, 14.2, 14.3, 14.4**

- [ ]* 15.5 Write unit tests for admin features
  - Test product form validation
  - Test order status updates
  - Test user role management

- [ ] 16. Implement error handling and user feedback
  - Create ErrorBoundary component for each microfrontend
  - Create Toast notification system with react-hot-toast
  - Implement global error handler in Axios interceptors
  - Create error fallback UI components
  - Implement form validation error display
  - Add retry buttons for network errors
  - Implement error logging to console
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ]* 16.1 Write property test for error boundary
  - **Property 27: Error boundary fallback**
  - **Validates: Requirements 12.1**

- [ ]* 16.2 Write property test for API error toasts
  - **Property 28: API error toast notifications**
  - **Validates: Requirements 12.2**

- [ ]* 16.3 Write property test for form validation errors
  - **Property 29: Form validation error display**
  - **Validates: Requirements 12.3**

- [ ]* 16.4 Write property test for network error retry
  - **Property 30: Network error retry availability**
  - **Validates: Requirements 12.4**

- [ ]* 16.5 Write property test for error logging
  - **Property 31: Error logging**
  - **Validates: Requirements 12.5**

- [ ] 17. Implement responsive design and loading states
  - Add responsive breakpoints to all components
  - Create Skeleton loader components
  - Add loading states to all data fetching operations
  - Implement mobile navigation menu
  - Test responsive layouts on different screen sizes
  - Add animations with Framer Motion
  - _Requirements: 9.2, 9.4, 9.5, 9.6_

- [ ]* 17.1 Write property test for responsive layout
  - **Property 23: Responsive layout adaptation**
  - **Validates: Requirements 9.2**

- [ ]* 17.2 Write property test for form validation states
  - **Property 24: Form validation state display**
  - **Validates: Requirements 9.4**

- [ ]* 17.3 Write property test for global loading indicator
  - **Property 17: Global loading indicator**
  - **Validates: Requirements 5.6**

- [ ] 18. Implement API response transformation
  - Create data transformation utilities for each service
  - Implement response transformers in Axios interceptors
  - Add schema validation with Zod for API responses
  - _Requirements: 5.5_

- [ ]* 18.1 Write property test for API response transformation
  - **Property 16: API response transformation**
  - **Validates: Requirements 5.5**

- [ ] 19. Optimize performance
  - Implement code splitting for each microfrontend
  - Add lazy loading for heavy components
  - Implement image lazy loading with Intersection Observer
  - Configure React Query prefetching for predictable navigation
  - Add React.memo to expensive components
  - Implement virtualization for long lists with react-window
  - Optimize Zustand selectors to prevent unnecessary re-renders
  - _Requirements: 10.1, 10.2, 10.3_

- [ ]* 19.1 Write integration tests for performance
  - Test code splitting works correctly
  - Test lazy loading triggers at right time
  - Test query prefetching improves navigation

- [ ] 20. Set up CDN and asset optimization
  - Configure CDN URLs in environment variables
  - Implement image upload to CDN in admin
  - Add responsive image srcset attributes
  - Configure WebP format with fallbacks
  - Add blur-up placeholder technique
  - Configure cache headers in build output
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ]* 20.1 Write unit tests for CDN integration
  - Test image upload to CDN
  - Test CDN URL generation
  - Test fallback for failed CDN loads

- [ ] 21. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 22. Create environment configuration
  - Set up .env files for development, staging, production
  - Configure service URLs for each environment
  - Add CDN URLs, API keys, and other environment-specific values
  - Document environment variables in README

- [ ] 23. Update Module Federation configuration for all microfrontends
  - Update host to load all 7 microfrontends (product, cart, checkout, order, customer, auth, admin)
  - Configure shared dependencies (React, React DOM, React Router, Zustand, React Query, Axios)
  - Set up proper port assignments (5173-5179)
  - Test microfrontend loading and communication

- [ ] 24. Write integration tests
  - Test microfrontend communication through event bus
  - Test state synchronization across microfrontends
  - Test authentication flow end-to-end
  - Test checkout process flow
  - Test cart persistence across page refreshes
  - Use MSW for API mocking

- [ ] 25. Write end-to-end tests with Playwright
  - Test complete user journey: Browse → Add to cart → Checkout → Order confirmation
  - Test user registration and login flow
  - Test admin product creation and management
  - Test search and filtering functionality
  - Test responsive design on mobile and desktop

- [ ] 26. Security hardening
  - Implement CSRF protection
  - Add input sanitization
  - Configure Content Security Policy headers
  - Review and fix any XSS vulnerabilities
  - Implement rate limiting on client side
  - Add API request signing for sensitive operations

- [ ] 27. Accessibility audit
  - Add ARIA labels to all interactive elements
  - Ensure keyboard navigation works throughout
  - Test with screen readers
  - Fix color contrast issues
  - Add focus indicators
  - Ensure WCAG 2.1 AA compliance

- [ ] 28. Documentation
  - Write README for each microfrontend
  - Document API service layer
  - Document Zustand store structure
  - Document event bus events
  - Create deployment guide
  - Create developer onboarding guide

- [ ] 29. Final testing and bug fixes
  - Run all unit tests
  - Run all property-based tests
  - Run all integration tests
  - Run all E2E tests
  - Fix any failing tests
  - Perform manual testing of all features


- [ ] 30. Implement inventory management
  - Add inventory tracking to product model
  - Implement inventory decrement on order creation
  - Create low stock warning component
  - Add out of stock validation in cart
  - Create inventory history log
  - Add inventory management UI in admin
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ]* 30.1 Write unit tests for inventory management
  - Test inventory decrement on purchase
  - Test low stock warnings
  - Test out of stock prevention

- [ ] 31. Implement product reviews and ratings
  - Create Review model and API integration
  - Create ReviewList component for product page
  - Create ReviewForm component for submitting reviews
  - Implement review submission mutation
  - Add review moderation UI in admin
  - Calculate and update product average rating
  - Add "verified purchase" badge for reviews
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [ ]* 31.1 Write unit tests for reviews
  - Test review submission validation
  - Test average rating calculation
  - Test review moderation

- [ ] 32. Implement wishlist functionality
  - Create Wishlist model and API integration
  - Create WishlistPage component
  - Create WishlistItem component
  - Add "Add to Wishlist" button on product cards
  - Implement add/remove wishlist mutations
  - Add wishlist icon in header with count
  - Implement price drop notifications
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

- [ ]* 32.1 Write unit tests for wishlist
  - Test add to wishlist
  - Test remove from wishlist
  - Test move to cart from wishlist

- [ ] 33. Implement discount codes and promotions
  - Create Promotion model and API integration
  - Create DiscountCodeInput component in cart
  - Implement discount validation logic
  - Add discount calculation to cart totals
  - Create promotion management UI in admin
  - Implement promotion rules (percentage, fixed amount, free shipping)
  - Add automatic best discount selection
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

- [ ]* 33.1 Write unit tests for discounts
  - Test discount code validation
  - Test discount calculation
  - Test multiple discount scenarios

- [ ] 34. Implement shipping methods and rates
  - Create ShippingMethod model and API integration
  - Create ShippingMethodSelector component in checkout
  - Implement shipping rate calculation based on address
  - Add free shipping threshold logic
  - Create shipping configuration UI in admin
  - Support multiple shipping carriers
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

- [ ]* 34.1 Write unit tests for shipping
  - Test shipping rate calculation
  - Test free shipping threshold
  - Test shipping method selection

- [ ] 35. Implement tax calculation
  - Create TaxRule model and API integration
  - Implement tax calculation based on shipping address
  - Add tax breakdown display in cart and checkout
  - Create tax configuration UI in admin
  - Support tax-exempt items
  - Handle multi-jurisdiction tax rules
  - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5_

- [ ]* 35.1 Write unit tests for tax calculation
  - Test tax calculation by region
  - Test tax-exempt items
  - Test tax breakdown display

- [ ] 36. Implement order cancellation and refunds
  - Add cancel order functionality to order detail page
  - Create RefundRequest component
  - Implement refund processing in admin
  - Add inventory restoration on refund
  - Create refund status tracking
  - Implement partial refund support
  - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_

- [ ]* 36.1 Write unit tests for refunds
  - Test order cancellation
  - Test refund processing
  - Test inventory restoration

- [ ] 37. Implement email notifications
  - Create email service integration
  - Create email templates (order confirmation, shipping, delivery, welcome, password reset)
  - Implement email sending on order events
  - Add email preferences in customer profile
  - Create email preview in admin
  - Implement email queue for reliability
  - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_

- [ ]* 37.1 Write unit tests for email notifications
  - Test email template rendering
  - Test email sending triggers
  - Test email preferences

- [ ] 38. Implement product recommendations
  - Create recommendation algorithm (related products, complementary, based on history)
  - Create RecommendedProducts component
  - Add recommendations to product detail page
  - Add recommendations to cart page
  - Add recommendations to order confirmation page
  - Implement recommendation tracking for analytics
  - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5_

- [ ]* 38.1 Write unit tests for recommendations
  - Test related products algorithm
  - Test complementary products logic
  - Test recommendation display

- [ ] 39. Implement multi-currency support
  - Create Currency model and API integration
  - Create CurrencySelector component in header
  - Implement currency conversion logic
  - Add exchange rate management in admin
  - Lock exchange rate at checkout
  - Display prices with currency symbol and code
  - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5_

- [ ]* 39.1 Write unit tests for multi-currency
  - Test currency conversion
  - Test exchange rate locking
  - Test currency display formatting

- [ ] 40. Implement guest checkout
  - Add guest checkout option on checkout page
  - Create guest order tracking page
  - Implement order lookup by email and order number
  - Add account creation offer after guest checkout
  - Handle duplicate email detection
  - _Requirements: 26.1, 26.2, 26.3, 26.4, 26.5_

- [ ]* 40.1 Write unit tests for guest checkout
  - Test guest checkout flow
  - Test order tracking without account
  - Test account creation after guest checkout

- [ ] 41. Implement product variants
  - Create ProductVariant model and API integration
  - Create VariantSelector component (size, color, etc.)
  - Update product images based on variant selection
  - Handle variant-specific pricing
  - Add variant inventory tracking
  - Create variant management UI in admin
  - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5_

- [ ]* 41.1 Write unit tests for product variants
  - Test variant selection
  - Test variant inventory
  - Test variant pricing

- [ ] 42. Implement bulk order management
  - Add bulk selection to orders table
  - Create bulk action toolbar
  - Implement bulk status update
  - Add bulk export to CSV
  - Implement bulk shipping label generation
  - Add error handling for failed bulk operations
  - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5_

- [ ]* 42.1 Write unit tests for bulk operations
  - Test bulk status updates
  - Test bulk export
  - Test error handling

- [ ] 43. Implement customer support chat
  - Integrate chat service (Socket.io or third-party like Intercom)
  - Create ChatWidget component
  - Create ChatInterface component
  - Implement real-time message delivery
  - Add chat management UI in admin
  - Save chat transcripts
  - Add offline message handling
  - _Requirements: 29.1, 29.2, 29.3, 29.4, 29.5_

- [ ]* 43.1 Write unit tests for chat
  - Test message sending
  - Test real-time updates
  - Test offline handling

- [ ] 44. Implement sales reports and analytics
  - Create comprehensive analytics dashboard
  - Add revenue, orders, and AOV metrics
  - Create date range filter component
  - Implement product performance reports
  - Add customer analytics (new vs returning, LTV)
  - Create report export functionality (CSV, PDF)
  - Add charts for visual data representation
  - _Requirements: 30.1, 30.2, 30.3, 30.4, 30.5_

- [ ]* 44.1 Write unit tests for analytics
  - Test metric calculations
  - Test report generation
  - Test data export

- [ ] 45. Final integration testing
  - Test complete user journey with all features
  - Test admin workflows with all management features
  - Test edge cases and error scenarios
  - Verify all business rules are enforced
  - Test performance with realistic data volumes

- [ ] 46. Production deployment preparation
  - Set up production environment variables
  - Configure production CDN
  - Set up production database
  - Configure production API endpoints
  - Set up monitoring and logging
  - Create deployment scripts
  - Document deployment process
