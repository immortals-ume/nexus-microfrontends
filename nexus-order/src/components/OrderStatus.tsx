import { Package, Truck, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import type { OrderStatus as OrderStatusType } from '../types';

interface OrderStatusProps {
  status: OrderStatusType;
  className?: string;
}

/**
 * OrderStatus component - Visual indicator for order status
 * Validates: Requirements 8.4 - Visual order status indicator
 */
export function OrderStatus({ status, className }: OrderStatusProps) {
  const statusConfig = {
    pending: {
      label: 'Pending',
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    },
    processing: {
      label: 'Processing',
      icon: RefreshCw,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    shipped: {
      label: 'Shipped',
      icon: Truck,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    delivered: {
      label: 'Delivered',
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50 border-green-200',
    },
    cancelled: {
      label: 'Cancelled',
      icon: XCircle,
      color: 'text-red-600 bg-red-50 border-red-200',
    },
    refunded: {
      label: 'Refunded',
      icon: Package,
      color: 'text-gray-600 bg-gray-50 border-gray-200',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-medium text-sm',
        config.color,
        className
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{config.label}</span>
    </div>
  );
}
