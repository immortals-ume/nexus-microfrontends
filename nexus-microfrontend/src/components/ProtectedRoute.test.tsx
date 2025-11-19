import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useStore } from '../store';

// Test components
function ProtectedContent() {
  return <div data-testid="protected-content">Protected Content</div>;
}

function LoginPage() {
  return <div data-testid="login-page">Login Page</div>;
}

// Helper to render with router
function renderWithRouter(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/protected" element={ui} />
      </Routes>
    </BrowserRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    // Reset auth state before each test
    useStore.getState().auth.logout();
  });

  it('redirects to login when not authenticated', () => {
    // Set initial route to /protected
    window.history.pushState({}, '', '/protected');

    renderWithRouter(
      <ProtectedRoute>
        <ProtectedContent />
      </ProtectedRoute>
    );

    // Should redirect to login
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    // Set authenticated state
    useStore.setState((state) => ({
      auth: {
        ...state.auth,
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
      },
    }));

    window.history.pushState({}, '', '/protected');

    renderWithRouter(
      <ProtectedRoute>
        <ProtectedContent />
      </ProtectedRoute>
    );

    // Should render protected content
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });

  it('shows loading state while checking authentication', () => {
    // Set loading state
    useStore.setState((state) => ({
      auth: {
        ...state.auth,
        isLoading: true,
      },
    }));

    window.history.pushState({}, '', '/protected');

    renderWithRouter(
      <ProtectedRoute>
        <ProtectedContent />
      </ProtectedRoute>
    );

    // Should show loading message
    expect(screen.getByText(/verifying authentication/i)).toBeInTheDocument();
  });

  it('blocks non-admin users from admin routes', () => {
    // Set authenticated as regular user
    useStore.setState((state) => ({
      auth: {
        ...state.auth,
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
      },
    }));

    window.history.pushState({}, '', '/protected');

    renderWithRouter(
      <ProtectedRoute requireAdmin={true}>
        <ProtectedContent />
      </ProtectedRoute>
    );

    // Should show access denied
    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('allows admin users to access admin routes', () => {
    // Set authenticated as admin
    useStore.setState((state) => ({
      auth: {
        ...state.auth,
        user: {
          id: '1',
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
      },
    }));

    window.history.pushState({}, '', '/protected');

    renderWithRouter(
      <ProtectedRoute requireAdmin={true}>
        <ProtectedContent />
      </ProtectedRoute>
    );

    // Should render protected content
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
});
