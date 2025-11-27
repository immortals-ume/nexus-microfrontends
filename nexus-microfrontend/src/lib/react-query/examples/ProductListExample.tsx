// /**
//  * Example Component: Product List with React Query
//  *
//  * This example demonstrates:
//  * - Using custom hooks for data fetching
//  * - Handling loading and error states
//  * - Using mutations with cache invalidation
//  * - Optimistic updates
//  */
//
// import { useState } from 'react';
// import { useProducts, useCreateProduct, useDeleteProduct } from '../hooks';
// import type { ProductFilters } from '../../../services/types';
//
// export function ProductListExample() {
//   const [filters, setFilters] = useState<ProductFilters>({
//     sortBy: 'newest',
//     page: 1,
//     limit: 20,
//   });
//
//   // Fetch products with filters
//   const { data, isLoading, error, refetch } = useProducts(filters);
//
//   // Create product mutation
//   const createProduct = useCreateProduct();
//
//   // Delete product mutation
//   const deleteProduct = useDeleteProduct();
//
//   // Handle filter changes
//   const handleCategoryChange = (category: string) => {
//     setFilters((prev) => ({ ...prev, category, page: 1 }));
//   };
//
//   // Handle product creation
//   const handleCreateProduct = async () => {
//     try {
//       await createProduct.mutateAsync({
//         name: 'New Product',
//         description: 'A great product',
//         price: 99.99,
//         categoryId: 'electronics',
//         stock: 100,
//         sku: 'PROD-001',
//         images: [],
//       });
//       alert('Product created successfully!');
//     } catch (error) {
//       alert('Failed to create product');
//     }
//   };
//
//   // Handle product deletion
//   const handleDeleteProduct = async (id: string) => {
//     if (confirm('Are you sure you want to delete this product?')) {
//       try {
//         await deleteProduct.mutateAsync(id);
//         alert('Product deleted successfully!');
//       } catch (error) {
//         alert('Failed to delete product');
//       }
//     }
//   };
//
//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="p-4">
//         <div className="animate-pulse space-y-4">
//           {[...Array(5)].map((_, i) => (
//             <div key={i} className="h-20 bg-gray-200 rounded" />
//           ))}
//         </div>
//       </div>
//     );
//   }
//
//   // Error state
//   if (error) {
//     return (
//       <div className="p-4">
//         <div className="bg-red-50 border border-red-200 rounded p-4">
//           <h3 className="text-red-800 font-semibold">Error loading products</h3>
//           <p className="text-red-600">{error.message}</p>
//           <button
//             onClick={() => refetch()}
//             className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }
//
//   return (
//     <div className="p-4">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Products</h1>
//         <button
//           onClick={handleCreateProduct}
//           disabled={createProduct.isPending}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//         >
//           {createProduct.isPending ? 'Creating...' : 'Create Product'}
//         </button>
//       </div>
//
//       {/* Filters */}
//       <div className="mb-4 flex gap-2">
//         <select
//           value={filters.category || ''}
//           onChange={(e) => handleCategoryChange(e.target.value)}
//           className="px-3 py-2 border rounded"
//         >
//           <option value="">All Categories</option>
//           <option value="electronics">Electronics</option>
//           <option value="clothing">Clothing</option>
//           <option value="books">Books</option>
//         </select>
//
//         <select
//           value={filters.sortBy}
//           onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
//           className="px-3 py-2 border rounded"
//         >
//           <option value="newest">Newest</option>
//           <option value="price_asc">Price: Low to High</option>
//           <option value="price_desc">Price: High to Low</option>
//           <option value="rating">Rating</option>
//         </select>
//       </div>
//
//       {/* Product List */}
//       <div className="space-y-4">
//         {data?.data.map((product) => (
//           <div key={product.id} className="border rounded p-4 flex justify-between items-center">
//             <div>
//               <h3 className="font-semibold">{product.name}</h3>
//               <p className="text-gray-600">${product.price.toFixed(2)}</p>
//               <p className="text-sm text-gray-500">Stock: {product.stock}</p>
//             </div>
//             <button
//               onClick={() => handleDeleteProduct(product.id)}
//               disabled={deleteProduct.isPending}
//               className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
//             >
//               {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
//             </button>
//           </div>
//         ))}
//       </div>
//
//       {/* Pagination */}
//       {data && data.totalPages > 1 && (
//         <div className="mt-6 flex justify-center gap-2">
//           <button
//             onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
//             disabled={filters.page === 1}
//             className="px-4 py-2 border rounded disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="px-4 py-2">
//             Page {filters.page} of {data.totalPages}
//           </span>
//           <button
//             onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
//             disabled={filters.page === data.totalPages}
//             className="px-4 py-2 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
