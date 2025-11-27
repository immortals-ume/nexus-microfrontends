import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  shimmer?: boolean
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'text', width, height, shimmer = true, className = '', ...props }, ref) => {
    const variantStyles = {
      text: 'rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-lg',
    }
    
    const style = {
      width: width || (variant === 'circular' ? '40px' : '100%'),
      height: height || (variant === 'text' ? '1em' : variant === 'circular' ? '40px' : '100px'),
    }
    
    const shimmerClass = shimmer 
      ? 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent'
      : ''
    
    return (
      <div
        ref={ref}
        className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${variantStyles[variant]} ${shimmerClass} ${className}`}
        style={style}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

export default Skeleton
