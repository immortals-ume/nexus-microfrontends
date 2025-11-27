/**
 * Render Props Pattern Examples
 * 
 * This pattern allows components to share code using a prop whose value is a function
 * The component calls this function instead of implementing its own render logic
 * 
 * Benefits:
 * - Flexible composition
 * - Reusable logic with custom rendering
 * - Inversion of control
 * - Type-safe with TypeScript
 */

import React, { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

/**
 * Example 1: DataTable with Render Props
 */

interface Column<T> {
  key: keyof T;
  header: string;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  renderRow?: (item: T, index: number) => ReactNode;
  renderCell?: (item: T, column: Column<T>) => ReactNode;
  renderEmpty?: () => ReactNode;
  renderHeader?: (column: Column<T>) => ReactNode;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  renderRow,
  renderCell,
  renderEmpty,
  renderHeader,
  onRowClick,
}: DataTableProps<T>) {
  // Default empty state
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        {renderEmpty ? renderEmpty() : <p className="text-gray-600">No data available</p>}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: column.width }}
              >
                {renderHeader ? renderHeader(column) : column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => {
            // Custom row rendering
            if (renderRow) {
              return <React.Fragment key={item.id}>{renderRow(item, index)}</React.Fragment>;
            }

            // Default row rendering
            return (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap">
                    {renderCell ? renderCell(item, column) : String(item[column.key])}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Usage Example: Product Table with Custom Rendering
 */
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export function ProductTableExample() {
  const products: Product[] = [
    { id: '1', name: 'Product 1', price: 29.99, stock: 10, category: 'Electronics' },
    { id: '2', name: 'Product 2', price: 49.99, stock: 0, category: 'Clothing' },
  ];

  const columns: Column<Product>[] = [
    { key: 'name', header: 'Product Name', width: '40%' },
    { key: 'price', header: 'Price', width: '20%' },
    { key: 'stock', header: 'Stock', width: '20%' },
    { key: 'category', header: 'Category', width: '20%' },
  ];

  return (
    <DataTable
      data={products}
      columns={columns}
      renderCell={(product, column) => {
        // Custom cell rendering
        if (column.key === 'price') {
          return <span className="font-semibold text-green-600">${product.price.toFixed(2)}</span>;
        }
        if (column.key === 'stock') {
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          );
        }
        return String(product[column.key]);
      }}
      renderEmpty={() => (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No products found</p>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
            Add Product
          </button>
        </div>
      )}
      onRowClick={(product) => console.log('Clicked:', product.name)}
    />
  );
}

/**
 * Example 2: List Component with Render Props
 */

interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  renderEmpty?: () => ReactNode;
  renderLoading?: () => ReactNode;
  renderError?: (error: Error) => ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  className?: string;
  itemClassName?: string;
}

export function List<T>({
  items,
  renderItem,
  renderEmpty,
  renderLoading,
  renderError,
  isLoading,
  error,
  className = '',
  itemClassName = '',
}: ListProps<T>) {
  if (isLoading) {
    return (
      <div className={className}>
        {renderLoading ? renderLoading() : <div>Loading...</div>}
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        {renderError ? renderError(error) : <div>Error: {error.message}</div>}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={className}>
        {renderEmpty ? renderEmpty() : <div>No items</div>}
      </div>
    );
  }

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={index} className={itemClassName}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

/**
 * Usage Example: Product List with Custom Rendering
 */
export function ProductListExample() {
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      return response.json();
    },
  });

  return (
    <List
      items={products}
      isLoading={isLoading}
      error={error as Error | null}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      itemClassName="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow"
      renderItem={(product) => (
        <>
          <img
            src={`/images/${product.id}.jpg`}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-t-lg"
          />
          <div className="p-4">
            <h3 className="font-semibold text-gray-900">{product.name}</h3>
            <p className="text-primary-600 font-bold">${product.price.toFixed(2)}</p>
            <span className="text-sm text-gray-600">{product.category}</span>
          </div>
        </>
      )}
      renderLoading={() => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}
      renderEmpty={() => (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No products available</p>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
            Browse Catalog
          </button>
        </div>
      )}
    />
  );
}

/**
 * Example 3: Data Fetcher with Render Props
 */

interface DataFetcherProps<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  children: (data: {
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  }) => ReactNode;
}

export function DataFetcher<T>({ queryKey, queryFn, children }: DataFetcherProps<T>) {
  const { data, isLoading, error, refetch } = useQuery<T>({
    queryKey,
    queryFn,
  });

  return <>{children({ data, isLoading, error: error as Error | null, refetch })}</>;
}

/**
 * Usage Example: Fetch and Display User Data
 */
interface User {
  id: string;
  name: string;
  email: string;
}

export function UserDataExample() {
  return (
    <DataFetcher<User>
      queryKey={['user', '123']}
      queryFn={async () => {
        const response = await fetch('/api/user/123');
        return response.json();
      }}
    >
      {({ data: user, isLoading, error, refetch }) => {
        if (isLoading) return <div>Loading user...</div>;
        if (error) return <div>Error: {error.message}</div>;
        if (!user) return <div>No user found</div>;

        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg"
            >
              Refresh
            </button>
          </div>
        );
      }}
    </DataFetcher>
  );
}

/**
 * Example 4: Toggle Component with Render Props
 */

interface ToggleProps {
  defaultValue?: boolean;
  children: (props: {
    isOn: boolean;
    toggle: () => void;
    setOn: () => void;
    setOff: () => void;
  }) => ReactNode;
}

export function Toggle({ defaultValue = false, children }: ToggleProps) {
  const [isOn, setIsOn] = React.useState(defaultValue);

  const toggle = () => setIsOn((prev) => !prev);
  const setOn = () => setIsOn(true);
  const setOff = () => setIsOn(false);

  return <>{children({ isOn, toggle, setOn, setOff })}</>;
}

/**
 * Usage Example: Custom Toggle UI
 */
export function ToggleExample() {
  return (
    <Toggle defaultValue={false}>
      {({ isOn, toggle }) => (
        <div className="flex items-center space-x-3">
          <button
            onClick={toggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isOn ? 'bg-primary-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isOn ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-sm text-gray-700">
            {isOn ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      )}
    </Toggle>
  );
}
