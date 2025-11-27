/**
 * Responsive Design Utilities
 * 
 * Utilities for working with responsive breakpoints and layouts
 */

/**
 * Tailwind CSS Breakpoints
 */
export const breakpoints = {
  sm: 640,   // Mobile landscape
  md: 768,   // Tablet
  lg: 1024,  // Desktop
  xl: 1280,  // Wide desktop
  '2xl': 1536, // Ultra-wide
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Get current breakpoint based on window width
 */
export function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'sm';
  
  const width = window.innerWidth;
  
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  return 'sm';
}

/**
 * Check if current viewport matches a breakpoint
 */
export function matchesBreakpoint(breakpoint: Breakpoint, direction: 'up' | 'down' = 'up'): boolean {
  if (typeof window === 'undefined') return false;
  
  const width = window.innerWidth;
  const breakpointValue = breakpoints[breakpoint];
  
  return direction === 'up' ? width >= breakpointValue : width < breakpointValue;
}

/**
 * Responsive class name helpers
 */
export const responsiveClasses = {
  // Grid layouts
  grid: {
    cols1: 'grid-cols-1',
    cols2: 'grid-cols-1 sm:grid-cols-2',
    cols3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    cols4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    cols5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    cols6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  },
  
  // Gap spacing
  gap: {
    sm: 'gap-2 sm:gap-3 md:gap-4',
    md: 'gap-4 sm:gap-5 md:gap-6',
    lg: 'gap-6 sm:gap-7 md:gap-8',
  },
  
  // Padding
  padding: {
    sm: 'px-4 py-2 sm:px-6 sm:py-3',
    md: 'px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6',
    lg: 'px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-12',
  },
  
  // Container
  container: 'px-4 sm:px-6 lg:px-8',
  
  // Text sizes
  text: {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl md:text-4xl',
    '3xl': 'text-3xl sm:text-4xl md:text-5xl',
    '4xl': 'text-4xl sm:text-5xl md:text-6xl',
  },
  
  // Visibility
  hide: {
    mobile: 'hidden sm:block',
    tablet: 'hidden md:block',
    desktop: 'hidden lg:block',
  },
  
  show: {
    mobileOnly: 'block sm:hidden',
    tabletOnly: 'hidden sm:block md:hidden',
    desktopOnly: 'hidden lg:block',
  },
} as const;

/**
 * Get responsive value based on current breakpoint
 */
export function getResponsiveValue<T>(values: {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
  default: T;
}): T {
  const breakpoint = getCurrentBreakpoint();
  
  // Return the value for the current breakpoint or the closest smaller one
  if (breakpoint === '2xl' && values['2xl']) return values['2xl'];
  if ((breakpoint === '2xl' || breakpoint === 'xl') && values.xl) return values.xl;
  if ((breakpoint === '2xl' || breakpoint === 'xl' || breakpoint === 'lg') && values.lg) return values.lg;
  if ((breakpoint === '2xl' || breakpoint === 'xl' || breakpoint === 'lg' || breakpoint === 'md') && values.md) return values.md;
  if (values.sm) return values.sm;
  
  return values.default;
}

/**
 * Responsive image sizes
 */
export function getResponsiveImageSizes(sizes?: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}): string {
  const { mobile = '100vw', tablet = '50vw', desktop = '33vw' } = sizes || {};
  return `(max-width: 640px) ${mobile}, (max-width: 1024px) ${tablet}, ${desktop}`;
}

/**
 * Responsive columns for grid
 */
export function getResponsiveColumns(count: number): string {
  if (count <= 1) return responsiveClasses.grid.cols1;
  if (count === 2) return responsiveClasses.grid.cols2;
  if (count === 3) return responsiveClasses.grid.cols3;
  if (count === 4) return responsiveClasses.grid.cols4;
  if (count === 5) return responsiveClasses.grid.cols5;
  return responsiveClasses.grid.cols6;
}
