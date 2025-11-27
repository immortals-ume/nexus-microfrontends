# Nexus Product Microfrontend

Product catalog microfrontend for the Nexus e-commerce platform.

## Features

- **Product Grid**: Responsive grid layout displaying products with images, names, prices, and ratings
- **Product Detail**: Detailed product view with image gallery, description, and reviews
- **Search Bar**: Real-time search with autocomplete suggestions
- **Filter Sidebar**: Category, price range, and sort filters
- **React Query Integration**: Efficient data fetching and caching
- **Module Federation**: Exposes components to the host application

## Exposed Components

This microfrontend exposes the following components via Module Federation:

- `./App` - Main application component
- `./ProductGrid` - Product grid component
- `./ProductCard` - Individual product card
- `./ProductDetail` - Product detail page
- `./SearchBar` - Search bar with autocomplete
- `./FilterSidebar` - Filter sidebar component

## Development

```bash
# Install dependencies
npm install

# Start development server (port 5173)
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run tests with UI
npm run test:ui
```

## Environment Variables

Create a `.env` file with:

```
VITE_PRODUCT_SERVICE_URL=http://localhost:8081/api/products
```

## Integration with Host

The host application can load this microfrontend by configuring Module Federation:

```typescript
remotes: {
  product: "http://localhost:5173/assets/remoteEntry.js"
}
```

Then import components:

```typescript
import ProductGrid from 'product/ProductGrid';
import ProductDetail from 'product/ProductDetail';
```

## Requirements Covered

- **2.1**: Product catalog display with images, names, prices, and ratings
- **2.2**: Product search functionality
- **2.3**: Category filtering
- **2.4**: Product sorting (price, rating, newest)
- **2.5**: Loading states with skeleton loaders
- **2.6**: Product detail page with full information
- **15.1**: Search with autocomplete
- **15.2**: Price range filtering
- **15.3**: Multiple filter combination (AND logic)
- **15.4**: Clear filters functionality
- **15.5**: Empty state handling

## Architecture

- **React Query**: Data fetching and caching
- **Axios**: HTTP client for API communication
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety
- **Vitest**: Testing framework
