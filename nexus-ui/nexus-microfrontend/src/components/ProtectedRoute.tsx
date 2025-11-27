import {type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

/**
 * ProtectedRoute Component
 * 
 * Route guard component that protects routes requiring authentication.
 * Redirects unauthenticated users to login page.
 * 
 * Features:
 * - Checks authentication status from Zustand store
 * - Preserves intended destination in location state
 * - Optional admin role requirement
 * - Shows loading state while checking auth
 * 
 * Usage:
 * <Route path="/profile" element={
 *   <ProtectedRoute>
 *     <ProfilePage />
 *   </ProtectedRoute>
 * } />
 */
export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useStore((state) => state.auth);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <div className="spinner" />
        <p style={{ marginLeft: '12px' }}>Verifying authentication...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin role if required
  if (requireAdmin && user?.role !== 'admin') {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center' 
      }}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <p>Admin privileges are required.</p>
      </div>
    );
  }

  return <>{children}</>;
}
