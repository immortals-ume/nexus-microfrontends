import { describe, it, expect } from 'vitest';
import { queryClient } from './queryClient';

describe('QueryClient Configuration', () => {
  it('should be configured with correct default options', () => {
    const defaultOptions = queryClient.getDefaultOptions();

    // Check query defaults
    expect(defaultOptions.queries?.staleTime).toBe(5 * 60 * 1000); // 5 minutes
    expect(defaultOptions.queries?.gcTime).toBe(10 * 60 * 1000); // 10 minutes
    expect(defaultOptions.queries?.retry).toBe(3);
    expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(true);
    expect(defaultOptions.queries?.refetchOnReconnect).toBe(true);
    expect(defaultOptions.queries?.refetchOnMount).toBe(false);
  });

  it('should have exponential backoff retry delay', () => {
    const defaultOptions = queryClient.getDefaultOptions();
    const retryDelay = defaultOptions.queries?.retryDelay;

    expect(retryDelay).toBeDefined();

    if (typeof retryDelay === 'function') {
      // Test exponential backoff: 1s, 2s, 4s
      expect(retryDelay(0)).toBe(1000); // 2^0 * 1000 = 1000ms
      expect(retryDelay(1)).toBe(2000); // 2^1 * 1000 = 2000ms
      expect(retryDelay(2)).toBe(4000); // 2^2 * 1000 = 4000ms

      // Test max delay cap at 30s
      expect(retryDelay(10)).toBe(30000); // Should be capped at 30000ms
    }
  });

  it('should have mutation retry configured', () => {
    const defaultOptions = queryClient.getDefaultOptions();

    expect(defaultOptions.mutations?.retry).toBe(1);
  });
});
