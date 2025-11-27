import { ChevronRight } from 'lucide-react';
import { OrderStatus } from './OrderStatus';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import type { Order } from '../types';

interface OrderCardProps {
  order: Order;
  onClick?: (order: Order) => void;
  className?: string;
}

/**
 * OrderCard component - Summary card for each order
 * Validates: Requirements 8.1 - Display order list with order numbers, dates, and totals
 */
export function OrderCard({ order, onClick, className }: OrderCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer',
        className
      )}
      onClick={() => onClick?.(order)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{order.orderNumber}</h3>
          <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatus status={order.status} />
      </div>

      <div className="space-y-3 mb-4">
        {order.items.slice(0, 2).map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <img
              src={item.productImage}
              alt={item.productName}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-medium text-gray-900">{formatCurrency(item.subtotal)}</p>
          </div>
        ))}
        {order.items.length > 2 && (
          <p className="text-sm text-gray-600">+{order.items.length - 2} more items</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(order.total)}</p>
        </div>
        <button className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
          View Details
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
