import { z } from 'zod';

/**
 * Validation schemas for checkout forms using Zod
 */

// Shipping address validation schema
export const shippingAddressSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  addressLine1: z.string().min(1, 'Address is required').max(100, 'Address is too long'),
  addressLine2: z.string().max(100, 'Address is too long').optional(),
  city: z.string().min(1, 'City is required').max(50, 'City name is too long'),
  state: z.string().min(2, 'State is required').max(50, 'State name is too long'),
  postalCode: z.string()
    .min(5, 'Postal code must be at least 5 characters')
    .max(10, 'Postal code is too long')
    .regex(/^[0-9-]+$/, 'Postal code must contain only numbers and hyphens'),
  country: z.string().min(2, 'Country is required').max(50, 'Country name is too long'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^[0-9+\-() ]+$/, 'Phone number contains invalid characters'),
});

// Payment method validation schema
export const paymentMethodSchema = z.object({
  type: z.enum(['credit_card', 'debit_card', 'paypal'], {
    required_error: 'Payment method type is required',
  }),
  cardNumber: z.string()
    .min(13, 'Card number must be at least 13 digits')
    .max(19, 'Card number is too long')
    .regex(/^[0-9 ]+$/, 'Card number must contain only numbers')
    .optional(),
  cardholderName: z.string()
    .min(1, 'Cardholder name is required')
    .max(100, 'Cardholder name is too long')
    .optional(),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Expiry date must be in MM/YY format')
    .optional(),
  cvv: z.string()
    .min(3, 'CVV must be 3 or 4 digits')
    .max(4, 'CVV must be 3 or 4 digits')
    .regex(/^[0-9]+$/, 'CVV must contain only numbers')
    .optional(),
  paypalEmail: z.string()
    .email('Invalid email address')
    .optional(),
}).refine(
  (data) => {
    // If credit_card or debit_card, require card fields
    if (data.type === 'credit_card' || data.type === 'debit_card') {
      return !!(data.cardNumber && data.cardholderName && data.expiryDate && data.cvv);
    }
    // If paypal, require email
    if (data.type === 'paypal') {
      return !!data.paypalEmail;
    }
    return true;
  },
  {
    message: 'Please provide all required payment information',
    path: ['type'],
  }
);

// Billing address validation schema (same as shipping)
export const billingAddressSchema = shippingAddressSchema;

// Export types inferred from schemas
export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;
export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;
export type BillingAddressFormData = z.infer<typeof billingAddressSchema>;
