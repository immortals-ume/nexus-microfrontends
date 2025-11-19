import type { StateCreator } from 'zustand';
import type { AppStore, CartSlice, Product, CartItem } from '../types';

// Helper function to generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper function to calculate cart totals
const calculateCartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  const total = subtotal + tax + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { subtotal, tax, shipping, total, itemCount };
};

export const createCartSlice: StateCreator<
  AppStore,
  [],
  [],
  CartSlice
> = (set, get) => ({
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  itemCount: 0,
  isLoading: false,
  error: null,

  addItem: (product: Product, quantity: number) => {
    set((state) => {
      const existingItem = state.cart.items.find(
        (item) => item.product.id === product.id
      );

      let newItems: CartItem[];
      if (existingItem) {
        // Update quantity of existing item
        newItems = state.cart.items.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * product.price,
              }
            : item
        );
      } else {
        // Add new item
        newItems = [
          ...state.cart.items,
          {
            id: generateId(),
            product,
            quantity,
            subtotal: product.price * quantity,
          },
        ];
      }

      const totals = calculateCartTotals(newItems);

      return {
        cart: {
          ...state.cart,
          items: newItems,
          ...totals,
        },
      };
    });

    // Persist to localStorage
    const cart = get().cart;
    localStorage.setItem('cart', JSON.stringify({
      items: cart.items,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      total: cart.total,
      itemCount: cart.itemCount,
    }));

    // Event bus emission will be added when event bus is integrated
  },

  removeItem: (productId: string) => {
    set((state) => {
      const newItems = state.cart.items.filter(
        (item) => item.product.id !== productId
      );

      const totals = calculateCartTotals(newItems);

      return {
        cart: {
          ...state.cart,
          items: newItems,
          ...totals,
        },
      };
    });

    // Persist to localStorage
    const cart = get().cart;
    localStorage.setItem('cart', JSON.stringify({
      items: cart.items,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      total: cart.total,
      itemCount: cart.itemCount,
    }));

    // Event bus emission will be added when event bus is integrated
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().cart.removeItem(productId);
      return;
    }

    set((state) => {
      const newItems = state.cart.items.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.product.price,
            }
          : item
      );

      const totals = calculateCartTotals(newItems);

      return {
        cart: {
          ...state.cart,
          items: newItems,
          ...totals,
        },
      };
    });

    // Persist to localStorage
    const cart = get().cart;
    localStorage.setItem('cart', JSON.stringify({
      items: cart.items,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      total: cart.total,
      itemCount: cart.itemCount,
    }));

    // Event bus emission will be added when event bus is integrated
  },

  clearCart: () => {
    set((state) => ({
      cart: {
        ...state.cart,
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        itemCount: 0,
      },
    }));

    // Clear from localStorage
    localStorage.removeItem('cart');

    // Event bus emission will be added when event bus is integrated
  },

  setLoading: (isLoading: boolean) => {
    set((state) => ({
      cart: { ...state.cart, isLoading },
    }));
  },

  setError: (error: string | null) => {
    set((state) => ({
      cart: { ...state.cart, error },
    }));
  },

  clearError: () => {
    set((state) => ({
      cart: { ...state.cart, error: null },
    }));
  },
});
