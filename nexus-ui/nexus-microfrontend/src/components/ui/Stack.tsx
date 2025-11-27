import { forwardRef } from 'react'
import type { ReactNode, HTMLAttributes } from 'react'

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'vertical' | 'horizontal'
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  children: ReactNode
}

const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ direction = 'vertical', spacing = 'md', align = 'stretch', children, className = '', ...props }, ref) => {
    const directionStyles = {
      vertical: 'flex-col',
      horizontal: 'flex-row',
    }
    
    const spacingStyles = {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    }
    
    const alignStyles = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    }
    
    return (
      <div
        ref={ref}
        className={`
          flex 
          ${directionStyles[direction]} 
          ${spacingStyles[spacing]} 
          ${alignStyles[align]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Stack.displayName = 'Stack'

export default Stack
