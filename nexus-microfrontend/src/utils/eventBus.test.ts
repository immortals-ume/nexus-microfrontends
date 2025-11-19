import { describe, it, expect, beforeEach } from 'vitest'
import * as fc from 'fast-check'
import { eventBus } from './eventBus'

describe('EventBus', () => {
  beforeEach(() => {
    // Clear all events before each test
    eventBus.clear()
  })

  it('subscribes and publishes events', () => {
    let received: any = null
    const unsubscribe = eventBus.subscribe('test-event', (data) => {
      received = data
    })

    eventBus.publish('test-event', { message: 'hello' })
    expect(received).toEqual({ message: 'hello' })

    unsubscribe()
  })

  it('unsubscribes correctly', () => {
    let callCount = 0
    const unsubscribe = eventBus.subscribe('test-event', () => {
      callCount++
    })

    eventBus.publish('test-event')
    expect(callCount).toBe(1)

    unsubscribe()
    eventBus.publish('test-event')
    expect(callCount).toBe(1) // Should not increment after unsubscribe
  })

  it('handles multiple subscribers', () => {
    const results: number[] = []
    
    eventBus.subscribe('test-event', () => results.push(1))
    eventBus.subscribe('test-event', () => results.push(2))
    eventBus.subscribe('test-event', () => results.push(3))

    eventBus.publish('test-event')
    expect(results).toEqual([1, 2, 3])
  })

  // Property-based test: Event bus broadcasting
  // Feature: ecommerce-mvp-upgrade, Property 26: Event bus broadcasting
  it('property: all registered listeners receive event data', () => {
    fc.assert(
      fc.property(
        fc.string(), // event name
        fc.array(fc.integer()), // array of listener IDs
        fc.anything(), // event data
        (eventName, listenerIds, eventData) => {
          // Skip empty listener arrays
          if (listenerIds.length === 0) return true

          const receivedData: any[] = []
          const unsubscribers: (() => void)[] = []

          // Subscribe all listeners
          listenerIds.forEach((id) => {
            const unsubscribe = eventBus.subscribe(eventName, (data) => {
              receivedData.push({ id, data })
            })
            unsubscribers.push(unsubscribe)
          })

          // Publish event
          eventBus.publish(eventName, eventData)

          // Verify all listeners received the data
          const allReceived = receivedData.length === listenerIds.length
          const allDataMatches = receivedData.every((item) => item.data === eventData)

          // Cleanup
          unsubscribers.forEach((unsub) => unsub())
          eventBus.clear(eventName)

          return allReceived && allDataMatches
        }
      ),
      { numRuns: 100 } // Run 100 iterations as per spec requirements
    )
  })

  // Property-based test: Unsubscribe prevents further notifications
  it('property: unsubscribed listeners do not receive events', () => {
    fc.assert(
      fc.property(
        fc.string(), // event name
        fc.integer({ min: 1, max: 10 }), // number of publishes before unsubscribe
        fc.integer({ min: 1, max: 10 }), // number of publishes after unsubscribe
        (eventName, beforeCount, afterCount) => {
          let callCount = 0
          const unsubscribe = eventBus.subscribe(eventName, () => {
            callCount++
          })

          // Publish events before unsubscribe
          for (let i = 0; i < beforeCount; i++) {
            eventBus.publish(eventName)
          }

          const countBeforeUnsubscribe = callCount

          // Unsubscribe
          unsubscribe()

          // Publish events after unsubscribe
          for (let i = 0; i < afterCount; i++) {
            eventBus.publish(eventName)
          }

          // Cleanup
          eventBus.clear(eventName)

          // Call count should not have changed after unsubscribe
          return callCount === countBeforeUnsubscribe && callCount === beforeCount
        }
      ),
      { numRuns: 100 }
    )
  })
})
