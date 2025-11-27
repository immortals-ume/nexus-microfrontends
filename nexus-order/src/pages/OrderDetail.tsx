import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOrderDetail } from '../hooks/useOrderDetail';
import { OrderStatus } from '../components/OrderStatus';
import { TrackingInfo } from '../components/TrackingInfo';
import { formatCurrency, formatDateTime } from '../lib/utils';
import { ArrowLeft, MapPin, CreditCard } from 'lucide-react';
import { onOrderStatusChanged } from '../lib/eventBus';
import { orderKeys } from '../hooks/useOrders';

interface OrderDetailProps {
  orderId: string;
  onBack?: () => void;
}

/**
 * OrderDetail page - Full order information display
 * Validates: Requirements 8.2 - Display detailed order information including items, shipping address, and status
 * Validates: Requirements 8.3 - Update order display when status changes
 */
export function OrderDetail({ orderId, onBack }: OrderDetailProps) {
  const queryClient = useQueryClient();
  const { data: order, isLoading, error } = useOrderDetail(orderId);

  // Listen for order status change events
  useEffect(() => {
    const unsubscribe = onOrderStatusChanged((event) => {
      // Only refetch if this is the order being viewed
      if (event.orderId === orderId) {
        queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      }
    });

    return unsubscribe;
  }, [orderId, queryClient]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">Failed to load order details</p>
          <p className="text-sm text-red-500 mt-1">{error?.message || 'Order not found'}</p>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </button>
        )}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{order.orderNumber}</h1>
            <p className="text-gray-600">Placed on {formatDateTime(order.createdAt)}</p>
          </div>
          <OrderStatus status={order.status} />
        </div>
      </div>

      {/* Tracking Info */}
      {order.trackingNumber && (
        <TrackingInfo
          trackingNumber={order.trackingNumber}
          trackingUrl={order.trackingUrl}
          className="mb-6"
        />
      )}

      {/* Order Items */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
              <img
                src={item.productImage}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-gray-900 mb-1">{item.productName}</h3>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-600">Price: {formatCurrency(item.price)}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(item.subtotal)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-900">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p className="pt-2">{order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900 capitalize">
              {order.paymentMethod.type.replace('_', ' ')}
            </p>
            {order.paymentMethod.brand && order.paymentMethod.last4 && (
              <p className="mt-1">
                {order.paymentMethod.brand} ending in {order.paymentMethod.last4}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-900">{formatCurrency(order.tax)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-900">
              {order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
