import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthProvider';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { useStore } from '../store';

// Test component that uses auth context
function TestAuthComponent() {
  const { isAuthenticated, user } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not authenticated'}</div>
      <div data-testid="user-name">{user?.firstName || 'no user'}</div>
    </div>
  );
}

// Test component that uses theme context
function TestThemeComponent() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <button onClick={toggleTheme} data-testid="toggle-theme">Toggle</button>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    // Reset store state before each test
    useStore.getState().auth.logout();
  });

  it('provides auth context to children', () => {
    render(
      <AuthProvider>
        <TestAuthComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated');
    expect(screen.getByTestId('user-name')).toHaveTextContent('no user');
  });

  it('reflects authentication state from store', async () => {
    render(
      <AuthProvider>
        <TestAuthComponent />
      </AuthProvider>
    );

    // Simulate login by updating store
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
      },
    }));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('user-name')).toHaveTextContent('John');
    });
  });

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = () => {};

    expect(() => {
      render(<TestAuthComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    console.error = originalError;
  });
});

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Reset theme to light
    useStore.getState().ui.setTheme('light');
  });

  it('provides theme context to children', () => {
    render(
      <ThemeProvider>
        <TestThemeComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('applies theme class to document root', () => {
    render(
      <ThemeProvider>
        <TestThemeComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('toggles theme when toggle is called', async () => {
    render(
      <ThemeProvider>
        <TestThemeComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');
    toggleButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = () => {};

    expect(() => {
      render(<TestThemeComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    console.error = originalError;
  });
});
