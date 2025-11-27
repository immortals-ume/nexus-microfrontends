import { forwardRef } from 'react'
import type { ReactNode, HTMLAttributes } from 'react'

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
}

const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 1, gap = 'md', children, className = '', ...props }, ref) => {
    const colsStyles = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
      12: 'grid-cols-12',
    }
    
    const gapStyles = {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    }
    
    return (
      <div
        ref={ref}
        className={`grid ${colsStyles[cols]} ${gapStyles[gap]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Grid.displayName = 'Grid'

export default Grid
