import { useState, useEffect } from 'react';
import { CheckoutProgress } from './CheckoutProgress';
import { ShippingForm } from './ShippingForm';
import { PaymentForm } from './PaymentForm';
import { OrderReview } from './OrderReview';
import { OrderConfirmation } from './OrderConfirmation';
import type { AppStore, CheckoutStep, CheckoutData, Address, PaymentMethod, Order } from '../types';

interface CheckoutWizardProps {
  useStore: <T>(selector: (state: AppStore) => T) => T;
  onOrderComplete?: (order: Order) => void;
  onContinueShopping?: () => void;
  onViewOrder?: (orderId: string) => void;
}

export function CheckoutWizard({
  useStore,
  onOrderComplete,
  onContinueShopping,
  onViewOrder,
}: CheckoutWizardProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [completedSteps, setCompletedSteps] = useState<CheckoutStep[]>([]);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    shippingAddress: null,
    billingAddress: null,
    paymentMethod: null,
    sameAsShipping: true,
  });
  const [order, setOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get cart data from store
  const cartItems = useStore((state) => state.cart.items);
  const subtotal = useStore((state) => state.cart.subtotal);
  const tax = useStore((state) => state.cart.tax);
  const shipping = useStore((state) => state.cart.shipping);
  const total = useStore((state) => state.cart.total);
  const clearCart = useStore((state) => state.cart.clearCart);
  const user = useStore((state) => state.auth.user);
  const token = useStore((state) => state.auth.token);

  // Check if user is authenticated
  useEffect(() => {
    if (!user || !token) {
      // Redirect to login or show error
      console.error('User must be authenticated to checkout');
    }
  }, [user, token]);

  const handleShippingSubmit = (address: Address) => {
    setCheckoutData((prev) => ({
      ...prev,
      shippingAddress: address,
      billingAddress: prev.sameAsShipping ? address : prev.billingAddress,
    }));
    setCompletedSteps((prev) => Array.from(new Set<CheckoutStep>([...prev, 'shipping'])));
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = (paymentMethod: PaymentMethod) => {
    setCheckoutData((prev) => ({
      ...prev,
      paymentMethod,
    }));
    setCompletedSteps((prev) => Array.from(new Set<CheckoutStep>([...prev, 'payment'])));
    setCurrentStep('review');
  };

  const handlePlaceOrder = async () => {
    if (!checkoutData.shippingAddress || !checkoutData.billingAddress || !checkoutData.paymentMethod) {
      setError('Missing required checkout information');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // In a real app, this would create an order DTO and call the API
      // const orderDto: CreateOrderDto = {
      //   items: cartItems.map((item) => ({
      //     productId: item.product.id,
      //     quantity: item.quantity,
      //     price: item.product.price,
      //   })),
      //   shippingAddress: checkoutData.shippingAddress,
      //   billingAddress: checkoutData.billingAddress,
      //   paymentMethodId: checkoutData.paymentMethod.id || 'temp-payment-id',
      // };

      // For now, we'll simulate the order creation
      const mockOrder: Order = {
        id: `order-${Date.now()}`,
        orderNumber: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        userId: user?.id || 'guest',
        items: cartItems.map((item) => ({
          id: item.id,
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.images[0]?.url || '',
          quantity: item.quantity,
          price: item.product.price,
          subtotal: item.subtotal,
        })),
        subtotal,
        tax,
        shipping,
        total,
        status: 'pending',
        shippingAddress: checkoutData.shippingAddress,
        billingAddress: checkoutData.billingAddress,
        paymentMethod: checkoutData.paymentMethod,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Set the order
      setOrder(mockOrder);
      setCompletedSteps((prev) => Array.from(new Set<CheckoutStep>([...prev, 'review'])));

      // Clear cart
      clearCart();

      // Emit order created event (if event bus is available)
      if (typeof window !== 'undefined' && (window as any).eventBus) {
        (window as any).eventBus.emit('order:created', {
          orderId: mockOrder.id,
          total: mockOrder.total,
        });
      }

      // Call callback
      if (onOrderComplete) {
        onOrderComplete(mockOrder);
      }
    } catch (err) {
      console.error('Failed to place order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditShipping = () => {
    setCurrentStep('shipping');
  };

  const handleEditPayment = () => {
    setCurrentStep('payment');
  };

  const handleBackToShipping = () => {
    setCurrentStep('shipping');
  };

  const handleContinueShopping = () => {
    if (onContinueShopping) {
      onContinueShopping();
    } else {
      window.location.href = '/';
    }
  };

  const handleViewOrder = () => {
    if (order && onViewOrder) {
      onViewOrder(order.id);
    } else if (order) {
      window.location.href = `/orders/${order.id}`;
    }
  };

  // If order is complete, show confirmation
  if (order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <OrderConfirmation
            order={order}
            onContinueShopping={handleContinueShopping}
            onViewOrder={handleViewOrder}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Indicator */}
        <CheckoutProgress currentStep={currentStep} completedSteps={completedSteps} />

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          {currentStep === 'shipping' && (
            <ShippingForm
              initialData={checkoutData.shippingAddress || undefined}
              onSubmit={handleShippingSubmit}
            />
          )}

          {currentStep === 'payment' && (
            <PaymentForm onSubmit={handlePaymentSubmit} onBack={handleBackToShipping} />
          )}

          {currentStep === 'review' && checkoutData.shippingAddress && checkoutData.billingAddress && checkoutData.paymentMethod && (
            <OrderReview
              shippingAddress={checkoutData.shippingAddress}
              billingAddress={checkoutData.billingAddress}
              paymentMethod={checkoutData.paymentMethod}
              cartItems={cartItems}
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
              onEditShipping={handleEditShipping}
              onEditPayment={handleEditPayment}
              onPlaceOrder={handlePlaceOrder}
              isProcessing={isProcessing}
            />
          )}
        </div>
      </div>
    </div>
  );
}
