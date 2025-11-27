import type { StateCreator } from 'zustand';
import type { AppStore, NotificationsSlice, Notification } from '../types';

export const createNotificationsSlice: StateCreator<
  AppStore,
  [],
  [],
  NotificationsSlice
> = (set) => ({
  items: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  setItems: (items: Notification[]) => {
    const unreadCount = items.filter((item) => !item.read).length;
    set((state) => ({
      notifications: { ...state.notifications, items, unreadCount },
    }));
  },

  markAsRead: (id: string) => {
    set((state) => {
      const newItems = state.notifications.items.map((item) =>
        item.id === id ? { ...item, read: true } : item
      );
      const unreadCount = newItems.filter((item) => !item.read).length;

      return {
        notifications: {
          ...state.notifications,
          items: newItems,
          unreadCount,
        },
      };
    });
  },

  markAllAsRead: () => {
    set((state) => {
      const newItems = state.notifications.items.map((item) => ({
        ...item,
        read: true,
      }));

      return {
        notifications: {
          ...state.notifications,
          items: newItems,
          unreadCount: 0,
        },
      };
    });
  },

  setLoading: (isLoading: boolean) => {
    set((state) => ({
      notifications: { ...state.notifications, isLoading },
    }));
  },

  setError: (error: string | null) => {
    set((state) => ({
      notifications: { ...state.notifications, error },
    }));
  },

  clearError: () => {
    set((state) => ({
      notifications: { ...state.notifications, error: null },
    }));
  },
});
