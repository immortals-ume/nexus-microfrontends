import { useEffect } from 'react';
import type { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

/**
 * Higher-Order Component that wraps a component with authentication check
 * Redirects to login page if user is not authenticated
 * 
 * @example
 * const ProtectedDashboard = withAuth(Dashboard);
 * const ProtectedProfile = withAuth(ProfilePage, { redirectTo: '/login' });
 */
export interface WithAuthOptions {
  redirectTo?: string;
  requiredRole?: 'customer' | 'admin';
}

export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { redirectTo = '/login', requiredRole } = options;

  return function AuthenticatedComponent(props: P) {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useStore((state) => state.auth);

    useEffect(() => {
      // Check if user is authenticated
      if (!isAuthenticated) {
        navigate(redirectTo, { replace: true });
        return;
      }

      // Check if user has required role
      if (requiredRole && user?.role !== requiredRole) {
        navigate('/', { replace: true });
      }
    }, [isAuthenticated, user, navigate]);

    // Don't render component if not authenticated or wrong role
    if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
      return null;
    }

    return <Component {...props} />;
  };
}

/**
 * HOC specifically for admin-only routes
 */
export function withAdminAuth<P extends object>(Component: ComponentType<P>) {
  return withAuth(Component, { requiredRole: 'admin', redirectTo: '/login' });
}

/**
 * HOC that redirects authenticated users away from a page
 * Useful for login/register pages
 */
export function withGuest<P extends object>(
  Component: ComponentType<P>,
  redirectTo: string = '/'
) {
  return function GuestComponent(props: P) {
    const navigate = useNavigate();
    const { isAuthenticated } = useStore((state) => state.auth);

    useEffect(() => {
      if (isAuthenticated) {
        navigate(redirectTo, { replace: true });
      }
    }, [isAuthenticated, navigate]);

    if (isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
