/**
 * Event Bus for microfrontend communication
 * Listens for order status change events
 * Validates: Requirements 8.3 - Update order display when status changes
 */

type EventHandler<T = any> = (data: T) => void;

interface EventBus {
  on<T>(event: string, handler: EventHandler<T>): () => void;
  emit<T>(event: string, data: T): void;
  off(event: string, handler: EventHandler): void;
}

class EventBusImpl implements EventBus {
  private events: Map<string, Set<EventHandler>> = new Map();

  on<T>(event: string, handler: EventHandler<T>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(handler);

    // Return unsubscribe function
    return () => this.off(event, handler);
  }

  emit<T>(event: string, data: T): void {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  off(event: string, handler: EventHandler): void {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }
}

// Singleton instance
export const eventBus = new EventBusImpl();

// Event types
export interface OrderStatusChangedEvent {
  orderId: string;
  status: string;
  updatedAt: Date;
}

// Helper to listen for order status changes
export function onOrderStatusChanged(
  handler: (event: OrderStatusChangedEvent) => void
): () => void {
  return eventBus.on('order:status-changed', handler);
}

// Helper to emit order status change
export function emitOrderStatusChanged(event: OrderStatusChangedEvent): void {
  eventBus.emit('order:status-changed', event);
}
