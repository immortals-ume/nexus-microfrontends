import { type ImgHTMLAttributes, forwardRef, useState } from 'react'

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
}

const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ size = 'md', fallback, src, alt, className = '', ...props }, ref) => {
    const [imageError, setImageError] = useState(false)
    
    const sizeStyles = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
      xl: 'h-16 w-16 text-lg',
    }
    
    const baseClasses = `${sizeStyles[size]} rounded-full object-cover ${className}`
    
    if (!src || imageError) {
      const initials = fallback || alt?.charAt(0).toUpperCase() || '?'
      return (
        <div
          className={`${baseClasses} bg-primary-100 text-primary-600 flex items-center justify-center font-medium`}
        >
          {initials}
        </div>
      )
    }
    
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={baseClasses}
        onError={() => setImageError(true)}
        {...props}
      />
    )
  }
)

Avatar.displayName = 'Avatar'

export default Avatar
