import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { cn } from '../lib/utils';

interface CartIconProps {
  itemCount: number;
  onClick?: () => void;
  className?: string;
}

export const CartIcon: React.FC<CartIconProps> = ({ itemCount, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center justify-center',
        'w-10 h-10 rounded-full',
        'text-gray-700 hover:text-primary-600',
        'hover:bg-gray-100 hover:scale-110',
        'active:scale-95',
        'transition-all duration-200 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        className
      )}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span
          className={cn(
            'absolute -top-1 -right-1',
            'flex items-center justify-center',
            'min-w-[20px] h-5 px-1',
            'bg-primary-600 text-white text-xs font-semibold',
            'rounded-full',
            'animate-bounce-in'
          )}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;
