# Product Microfrontend Verification Guide

## Quick Start

### 1. Start the Product Microfrontend

```bash
cd nexus-product
npm run dev
```

The product microfrontend should start on port 5173.

### 2. Start the Host Application

In a separate terminal:

```bash
cd nexus-microfrontend
npm run dev
```

The host application should start on port 5172.

### 3. Verify Integration

Open your browser and navigate to:
- Host: http://localhost:5172
- Products: http://localhost:5172/products

## Verification Checklist

### Component Verification

#### ProductCard
- [ ] Product image displays correctly
- [ ] Product name is visible
- [ ] Price is formatted correctly
- [ ] Rating stars display (5-star system)
- [ ] Review count shows in parentheses
- [ ] Discount badge appears when compareAtPrice exists
- [ ] Out of stock overlay shows when stock = 0
- [ ] Low stock warning shows when stock ≤ 10
- [ ] Hover effect works (shadow increases)
- [ ] Click navigates to product detail

#### ProductGrid
- [ ] Grid is responsive (1-4 columns based on screen size)
- [ ] Skeleton loaders show during loading
- [ ] Empty state displays when no products
- [ ] Products render in grid layout
- [ ] All product cards are clickable

#### SearchBar
- [ ] Search input accepts text
- [ ] Autocomplete dropdown appears after 2+ characters
- [ ] Debouncing works (300ms delay)
- [ ] Loading spinner shows during search
- [ ] Search results display with thumbnails
- [ ] Arrow keys navigate autocomplete results
- [ ] Enter key selects highlighted result
- [ ] Escape key closes autocomplete
- [ ] Click outside closes autocomplete
- [ ] Submit button triggers search

#### FilterSidebar
- [ ] Category checkboxes work
- [ ] Price range inputs accept numbers
- [ ] Apply button updates filters
- [ ] Sort radio buttons work
- [ ] Clear all button resets filters
- [ ] Active filters show in summary
- [ ] Remove filter buttons work
- [ ] Filters persist during navigation

#### ProductDetail
- [ ] Main product image displays
- [ ] Thumbnail gallery shows all images
- [ ] Clicking thumbnail changes main image
- [ ] Product name displays
- [ ] Rating and review count show
- [ ] Price displays correctly
- [ ] Discount badge shows when applicable
- [ ] Stock status is accurate
- [ ] Description is readable
- [ ] Category and tags display
- [ ] Quantity selector works
- [ ] Add to cart button is functional
- [ ] Back button returns to catalog
- [ ] SKU displays at bottom

### Functionality Verification

#### Search
- [ ] Search by product name works
- [ ] Search by description works
- [ ] Search by category works
- [ ] Autocomplete shows relevant results
- [ ] Selecting autocomplete result navigates to detail

#### Filtering
- [ ] Category filter returns correct products
- [ ] Price range filter works correctly
- [ ] Multiple filters combine with AND logic
- [ ] Clearing filters shows all products
- [ ] Filter state persists during search

#### Sorting
- [ ] Sort by newest works
- [ ] Sort by price (low to high) works
- [ ] Sort by price (high to low) works
- [ ] Sort by rating works

#### Pagination
- [ ] Previous button disabled on first page
- [ ] Next button disabled on last page
- [ ] Page number displays correctly
- [ ] Clicking next/previous changes page
- [ ] Products update when page changes

### API Integration Verification

#### React Query
- [ ] Initial data fetch works
- [ ] Loading state shows during fetch
- [ ] Error state shows on failure
- [ ] Retry button works after error
- [ ] Cache works (no refetch on revisit within 5 min)
- [ ] Background refetch works on window focus
- [ ] Query invalidation works after mutations

#### Axios
- [ ] Auth token included in requests (if logged in)
- [ ] 401 redirects to login
- [ ] Network errors show user-friendly message
- [ ] Timeout errors handled gracefully

### Module Federation Verification

#### Host Integration
- [ ] Product microfrontend loads in host
- [ ] Loading fallback shows during initial load
- [ ] Error boundary catches errors
- [ ] Navigation to /products works
- [ ] Products link in header works
- [ ] Shared dependencies load correctly

#### Exposed Components
- [ ] ProductGrid can be imported
- [ ] ProductCard can be imported
- [ ] ProductDetail can be imported
- [ ] SearchBar can be imported
- [ ] FilterSidebar can be imported

### Performance Verification

#### Loading Performance
- [ ] Images lazy load (check Network tab)
- [ ] Skeleton loaders improve perceived performance
- [ ] Code splitting works (check Network tab)
- [ ] Shared dependencies not duplicated

#### Caching
- [ ] React Query cache works
- [ ] No duplicate API calls for same data
- [ ] Background refetch doesn't block UI

### Accessibility Verification

#### Keyboard Navigation
- [ ] Tab key navigates through elements
- [ ] Enter/Space activates buttons
- [ ] Arrow keys work in autocomplete
- [ ] Escape closes modals/dropdowns
- [ ] Focus indicators visible

#### Screen Reader
- [ ] ARIA labels present
- [ ] Alt text on images
- [ ] Form labels associated with inputs
- [ ] Button purposes clear

### Responsive Design Verification

#### Mobile (< 640px)
- [ ] Grid shows 1 column
- [ ] Search bar full width
- [ ] Filter sidebar stacks properly
- [ ] Product detail readable

#### Tablet (640px - 1024px)
- [ ] Grid shows 2 columns
- [ ] Navigation accessible
- [ ] Images scale properly

#### Desktop (> 1024px)
- [ ] Grid shows 3-4 columns
- [ ] All features accessible
- [ ] Layout uses available space

## Common Issues & Solutions

### Issue: Product microfrontend won't start
**Solution**: Check if port 5173 is already in use. Kill the process or change the port in vite.config.ts

### Issue: Host can't load product microfrontend
**Solution**: 
1. Ensure product microfrontend is running on port 5173
2. Check browser console for CORS errors
3. Verify remoteEntry.js is accessible at http://localhost:5173/assets/remoteEntry.js

### Issue: Shared dependencies duplicated
**Solution**: Ensure version numbers match in both package.json files

### Issue: TypeScript errors
**Solution**: Run `npm install` in both projects to ensure all dependencies are installed

### Issue: Styles not loading
**Solution**: 
1. Check if Tailwind CSS is configured correctly
2. Verify postcss.config.js exists
3. Ensure index.css imports Tailwind directives

## Testing Commands

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm test

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build
npm run build
```

## Success Criteria

All checkboxes above should be checked for full verification. The product microfrontend should:

1. ✅ Load independently on port 5173
2. ✅ Integrate with host application
3. ✅ Display products in responsive grid
4. ✅ Support search with autocomplete
5. ✅ Support filtering by category and price
6. ✅ Support sorting by multiple criteria
7. ✅ Show detailed product view
8. ✅ Handle loading and error states
9. ✅ Be keyboard accessible
10. ✅ Work on mobile, tablet, and desktop

## Next Steps After Verification

1. Implement property-based tests (tasks 9.1-9.7)
2. Integrate with cart microfrontend
3. Add analytics tracking
4. Connect to real backend API
5. Implement CDN for images
6. Add more advanced features (reviews, wishlist, etc.)
