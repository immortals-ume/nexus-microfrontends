import { Edit2 } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import type { Address, PaymentMethod, CartItem } from '../types';

interface OrderReviewProps {
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  onEditShipping: () => void;
  onEditPayment: () => void;
  onPlaceOrder: () => void;
  isProcessing: boolean;
}

export function OrderReview({
  shippingAddress,
  billingAddress,
  paymentMethod,
  cartItems,
  subtotal,
  tax,
  shipping,
  total,
  onEditShipping,
  onEditPayment,
  onPlaceOrder,
  isProcessing,
}: OrderReviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Order</h2>
        <p className="text-gray-600">Please review your order details before placing your order</p>
      </div>

      {/* Order Items */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4">
              <img
                src={item.product.images[0]?.url || '/placeholder.png'}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatCurrency(item.subtotal)}</p>
                <p className="text-sm text-gray-600">{formatCurrency(item.product.price)} each</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
          <button
            onClick={onEditShipping}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>
        <div className="text-gray-700">
          <p className="font-medium">
            {shippingAddress.firstName} {shippingAddress.lastName}
          </p>
          <p>{shippingAddress.addressLine1}</p>
          {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
          <p>
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
          </p>
          <p>{shippingAddress.country}</p>
          <p className="mt-2">{shippingAddress.phone}</p>
        </div>
      </div>

      {/* Billing Address */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>
        <div className="text-gray-700">
          <p className="font-medium">
            {billingAddress.firstName} {billingAddress.lastName}
          </p>
          <p>{billingAddress.addressLine1}</p>
          {billingAddress.addressLine2 && <p>{billingAddress.addressLine2}</p>}
          <p>
            {billingAddress.city}, {billingAddress.state} {billingAddress.postalCode}
          </p>
          <p>{billingAddress.country}</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
          <button
            onClick={onEditPayment}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>
        <div className="text-gray-700">
          <p className="font-medium capitalize">{paymentMethod.type.replace('_', ' ')}</p>
          {paymentMethod.last4 && (
            <p className="text-sm">
              {paymentMethod.brand} ending in {paymentMethod.last4}
            </p>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Tax</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="border-t border-gray-300 pt-2 mt-2">
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={onPlaceOrder}
        disabled={isProcessing}
        className={cn(
          'w-full px-6 py-4 bg-primary-600 text-white rounded-lg font-semibold text-lg hover:bg-primary-700 transition-all',
          isProcessing && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isProcessing ? 'Processing Order...' : 'Place Order'}
      </button>

      <p className="text-sm text-gray-600 text-center">
        By placing your order, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
