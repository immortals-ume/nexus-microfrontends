// Simple event bus for cross-microfrontend communication
type EventCallback = (data: any) => void

class EventBus {
  private events: Map<string, EventCallback[]> = new Map()

  subscribe(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.events.get(event)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  publish(event: string, data?: any): void {
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error)
        }
      })
    }
  }

  clear(event?: string): void {
    if (event) {
      this.events.delete(event)
    } else {
      this.events.clear()
    }
  }
}

// Global singleton instance
export const eventBus = new EventBus()

// Make it available globally for microfrontends
if (typeof window !== 'undefined') {
  (window as any).eventBus = eventBus
}
