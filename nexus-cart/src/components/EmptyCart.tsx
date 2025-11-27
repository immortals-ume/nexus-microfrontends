import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { cn } from '../lib/utils';

interface EmptyCartProps {
  onContinueShopping?: () => void;
  className?: string;
}

export const EmptyCart: React.FC<EmptyCartProps> = ({ onContinueShopping, className }) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      {/* Icon */}
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <ShoppingBag className="w-12 h-12 text-gray-400" />
      </div>

      {/* Message */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
      <p className="text-sm text-gray-500 text-center mb-6 max-w-xs">
        Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
      </p>

      {/* CTA Button */}
      {onContinueShopping && (
        <button
          onClick={onContinueShopping}
          className={cn(
            'px-6 py-3 rounded-lg',
            'bg-primary-600 text-white font-semibold',
            'shadow-md hover:shadow-lg',
            'hover:bg-primary-700 hover:scale-[1.02]',
            'active:scale-[0.98]',
            'transition-all duration-200 ease-out',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
          )}
        >
          Continue Shopping
        </button>
      )}
    </div>
  );
};

export default EmptyCart;
