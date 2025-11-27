declare module 'cart/CartDrawer' {
  import { FC } from 'react';
  import type { AppStore } from './store/types';

  interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    useStore: <T>(selector: (state: AppStore) => T) => T;
    onCheckout?: () => void;
    onContinueShopping?: () => void;
  }

  export const CartDrawer: FC<CartDrawerProps>;
  export default CartDrawer;
}

declare module 'cart/CartIcon' {
  import { FC } from 'react';

  interface CartIconProps {
    itemCount: number;
    onClick?: () => void;
    className?: string;
  }

  export const CartIcon: FC<CartIconProps>;
  export default CartIcon;
}

declare module 'auth/LoginForm' {
  const LoginForm: React.ComponentType;
  export default LoginForm;
}

declare module 'auth/RegisterForm' {
  const RegisterForm: React.ComponentType;
  export default RegisterForm;
}

declare module 'product/ProductGrid' {
  const ProductGrid: React.ComponentType;
  export default ProductGrid;
}

declare module 'checkout/CheckoutWizard' {
  import { FC } from 'react';
  import type { AppStore } from './store/types';

  interface Order {
    id: string;
    orderNumber: string;
    total: number;
    [key: string]: any;
  }

  interface CheckoutWizardProps {
    useStore: <T>(selector: (state: AppStore) => T) => T;
    onOrderComplete?: (order: Order) => void;
    onContinueShopping?: () => void;
    onViewOrder?: (orderId: string) => void;
  }

  export const CheckoutWizard: FC<CheckoutWizardProps>;
  export default CheckoutWizard;
}

declare module 'checkout/CheckoutProgress' {
  import { FC } from 'react';

  type CheckoutStep = 'shipping' | 'payment' | 'review';

  interface CheckoutProgressProps {
    currentStep: CheckoutStep;
    completedSteps: CheckoutStep[];
  }

  export const CheckoutProgress: FC<CheckoutProgressProps>;
  export default CheckoutProgress;
}
