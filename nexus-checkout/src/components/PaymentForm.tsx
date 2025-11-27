import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, Wallet } from 'lucide-react';
import { paymentMethodSchema, type PaymentMethodFormData } from '../schemas/validation';
import { cn, formatCardNumber, formatExpiryDate, getCardBrand } from '../lib/utils';
import type { PaymentMethod } from '../types';

interface PaymentFormProps {
  onSubmit: (data: PaymentMethod) => void;
  onBack: () => void;
}

export function PaymentForm({ onSubmit, onBack }: PaymentFormProps) {
  const [paymentType, setPaymentType] = useState<'credit_card' | 'debit_card' | 'paypal'>('credit_card');
  const [cardBrand, setCardBrand] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: 'credit_card',
    },
  });

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setValue('cardNumber', formatted);
    setCardBrand(getCardBrand(formatted));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setValue('expiryDate', formatted);
  };

  const handleFormSubmit = (data: PaymentMethodFormData) => {
    const paymentMethod: PaymentMethod = {
      type: data.type,
      last4: data.cardNumber?.replace(/\s/g, '').slice(-4),
      brand: cardBrand || undefined,
    };
    onSubmit(paymentMethod);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Method</h2>
        <p className="text-gray-600">Select your payment method and enter details</p>
      </div>

      {/* Payment Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => {
            setPaymentType('credit_card');
            setValue('type', 'credit_card');
          }}
          className={cn(
            'p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all',
            paymentType === 'credit_card'
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          )}
        >
          <CreditCard className="w-8 h-8 text-primary-600" />
          <span className="font-medium">Credit Card</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setPaymentType('debit_card');
            setValue('type', 'debit_card');
          }}
          className={cn(
            'p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all',
            paymentType === 'debit_card'
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          )}
        >
          <CreditCard className="w-8 h-8 text-primary-600" />
          <span className="font-medium">Debit Card</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setPaymentType('paypal');
            setValue('type', 'paypal');
          }}
          className={cn(
            'p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all',
            paymentType === 'paypal'
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          )}
        >
          <Wallet className="w-8 h-8 text-primary-600" />
          <span className="font-medium">PayPal</span>
        </button>
      </div>

      {/* Card Payment Fields */}
      {(paymentType === 'credit_card' || paymentType === 'debit_card') && (
        <div className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Card Number *
            </label>
            <div className="relative">
              <input
                {...register('cardNumber')}
                type="text"
                id="cardNumber"
                maxLength={19}
                onChange={handleCardNumberChange}
                className={cn(
                  'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all',
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                )}
                placeholder="1234 5678 9012 3456"
              />
              {cardBrand && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  {cardBrand}
                </span>
              )}
            </div>
            {errors.cardNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name *
            </label>
            <input
              {...register('cardholderName')}
              type="text"
              id="cardholderName"
              className={cn(
                'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all',
                errors.cardholderName ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="John Doe"
            />
            {errors.cardholderName && (
              <p className="mt-1 text-sm text-red-600">{errors.cardholderName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date *
              </label>
              <input
                {...register('expiryDate')}
                type="text"
                id="expiryDate"
                maxLength={5}
                onChange={handleExpiryChange}
                className={cn(
                  'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all',
                  errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                )}
                placeholder="MM/YY"
              />
              {errors.expiryDate && (
                <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                CVV *
              </label>
              <input
                {...register('cvv')}
                type="text"
                id="cvv"
                maxLength={4}
                className={cn(
                  'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all',
                  errors.cvv ? 'border-red-500' : 'border-gray-300'
                )}
                placeholder="123"
              />
              {errors.cvv && (
                <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PayPal Fields */}
      {paymentType === 'paypal' && (
        <div>
          <label htmlFor="paypalEmail" className="block text-sm font-medium text-gray-700 mb-1">
            PayPal Email *
          </label>
          <input
            {...register('paypalEmail')}
            type="email"
            id="paypalEmail"
            className={cn(
              'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all',
              errors.paypalEmail ? 'border-red-500' : 'border-gray-300'
            )}
            placeholder="your.email@example.com"
          />
          {errors.paypalEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.paypalEmail.message}</p>
          )}
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          🔒 Your payment information is encrypted and secure. We never store your full card details.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all',
            isSubmitting && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSubmitting ? 'Processing...' : 'Continue to Review'}
        </button>
      </div>
    </form>
  );
}
