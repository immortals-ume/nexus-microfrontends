import { forwardRef } from 'react'
import type { ReactNode, HTMLAttributes } from 'react'

export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
}

const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ 
    direction = 'row', 
    align = 'start', 
    justify = 'start', 
    wrap = 'nowrap',
    gap = 'none',
    children, 
    className = '', 
    ...props 
  }, ref) => {
    const directionStyles = {
      row: 'flex-row',
      col: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'col-reverse': 'flex-col-reverse',
    }
    
    const alignStyles = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    }
    
    const justifyStyles = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    }
    
    const wrapStyles = {
      wrap: 'flex-wrap',
      nowrap: 'flex-nowrap',
      'wrap-reverse': 'flex-wrap-reverse',
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
        className={`
          flex 
          ${directionStyles[direction]} 
          ${alignStyles[align]} 
          ${justifyStyles[justify]}
          ${wrapStyles[wrap]}
          ${gapStyles[gap]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Flex.displayName = 'Flex'

export default Flex
