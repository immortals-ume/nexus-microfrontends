/**
 * Container/Presenter Pattern Examples
 * 
 * This pattern separates data fetching and business logic (Container)
 * from presentation and UI rendering (Presenter)
 * 
 * Benefits:
 * - Separation of concerns
 * - Easier testing (presenters are pure components)
 * - Reusable presenters with different data sources
 * - Clear data flow
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';

/**
 * Example 1: Product List Container/Presenter
 */

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}

interface ProductListPresenterProps {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
  onProductClick: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

// Presenter Component (Dumb/Presentational)
// Only handles rendering, receives all data via props
export function ProductListPresenter({
  products,
  isLoading,
  error,
  onProductClick,
  onAddToCart,
}: ProductListPresenterProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading products: {error.message}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onProductClick(product.id)}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-t-lg"
          />
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary-600">
                ${product.price.toFixed(2)}
              </span>
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product.id);
              }}
              className="mt-3 w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Container Component (Smart/Container)
// Handles data fetching, state management, and business logic
export function ProductListContainer() {
  // Data fetching
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      // Simulated API call
      const response = await fetch('/api/products');
      return response.json();
    },
  });

  // Business logic
  const handleProductClick = (productId: string) => {
    console.log('Navigate to product:', productId);
    // Navigation logic here
  };

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId);
    // Cart logic here
  };

  // Render presenter with data and handlers
  return (
    <ProductListPresenter
      products={products}
      isLoading={isLoading}
      error={error as Error | null}
      onProductClick={handleProductClick}
      onAddToCart={handleAddToCart}
    />
  );
}

/**
 * Example 2: User Profile Container/Presenter
 */

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
}

interface UserProfilePresenterProps {
  user: User;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (user: User) => void;
  onCancel: () => void;
}

// Presenter
export function UserProfilePresenter({
  user,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: UserProfilePresenterProps) {
  const [editedUser, setEditedUser] = React.useState(user);

  React.useEffect(() => {
    setEditedUser(user);
  }, [user]);

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={editedUser.name}
              onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={editedUser.email}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={editedUser.bio}
              onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => onSave(editedUser)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Save Changes
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Edit Profile
        </button>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Bio</h3>
        <p className="text-gray-600">{user.bio}</p>
      </div>
    </div>
  );
}

// Container
export function UserProfileContainer() {
  const [isEditing, setIsEditing] = React.useState(false);

  const { data: user, refetch } = useQuery<User>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await fetch('/api/user/profile');
      return response.json();
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedUser: User) => {
    try {
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <UserProfilePresenter
      user={user}
      isEditing={isEditing}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}

/**
 * Template for creating Container/Presenter components
 */

// 1. Define your data types
// interface MyData { ... }

// 2. Define presenter props (data + callbacks)
// interface MyPresenterProps {
//   data: MyData;
//   isLoading: boolean;
//   error: Error | null;
//   onAction: () => void;
// }

// 3. Create Presenter (pure component, no side effects)
// export function MyPresenter(props: MyPresenterProps) {
//   // Only rendering logic
//   return <div>...</div>;
// }

// 4. Create Container (handles data and logic)
// export function MyContainer() {
//   // Data fetching
//   const { data, isLoading, error } = useQuery(...);
//   
//   // Business logic
//   const handleAction = () => { ... };
//   
//   // Render presenter
//   return <MyPresenter data={data} onAction={handleAction} />;
// }
