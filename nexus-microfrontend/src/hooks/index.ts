/**
 * Custom hooks for the Nexus e-commerce application
 */

export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop, useIsLargeDesktop } from './useMediaQuery';
export { useDebounce, useDebouncedCallback } from './useDebounce';
export { useLocalStorage, useSessionStorage } from './useLocalStorage';
export {
  useCommandManager,
  StateChangeCommand,
  AddItemCommand,
  RemoveItemCommand,
  CompositeCommand,
  type Command,
} from './useCommandManager';
