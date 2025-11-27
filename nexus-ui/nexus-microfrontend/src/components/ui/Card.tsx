import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-white rounded-lg p-6',
      bordered: 'bg-white border border-gray-200 rounded-lg p-6',
      elevated: 'bg-white rounded-lg p-6 shadow-medium',
    }
    
    const classes = `${variantStyles[variant]} ${className}`
    
    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
