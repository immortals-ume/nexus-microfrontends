import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'text', width, height, className = '', ...props }, ref) => {
    const variantStyles = {
      text: 'rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-lg',
    }
    
    const style = {
      width: width || (variant === 'circular' ? '40px' : '100%'),
      height: height || (variant === 'text' ? '1em' : variant === 'circular' ? '40px' : '100px'),
    }
    
    return (
      <div
        ref={ref}
        className={`animate-pulse bg-gray-200 ${variantStyles[variant]} ${className}`}
        style={style}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

export default Skeleton
