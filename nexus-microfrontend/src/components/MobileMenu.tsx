import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { useEffect } from 'react';

/**
 * Mobile Menu Component
 * 
 * Slide-in mobile navigation menu with:
 * - Navigation links
 * - User profile section
 * - Theme toggle
 * - Smooth animations
 * - Backdrop overlay
 */
export function MobileMenu() {
  const location = useLocation();
  const isMobileMenuOpen = useStore((state) => state.ui.isMobileMenuOpen);
  const toggleMobileMenu = useStore((state) => state.ui.toggleMobileMenu);
  const { isAuthenticated, user, logout } = useStore((state) => state.auth);
  const { theme, setTheme } = useStore((state) => state.ui);

  // Close menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      toggleMobileMenu();
    }
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logout();
    toggleMobileMenu();
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (!isMobileMenuOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in lg:hidden"
        onClick={toggleMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu */}
      <div
        className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl z-50 animate-slide-in-right lg:hidden overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* User Section */}
        {isAuthenticated && user && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-lg">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          <Link
            to="/"
            className={`block px-4 py-3 rounded-lg transition-colors ${
              isActive('/')
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            🏠 Home
          </Link>
          <Link
            to="/products"
            className={`block px-4 py-3 rounded-lg transition-colors ${
              isActive('/products')
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            📦 Products
          </Link>
          <Link
            to="/dashboard"
            className={`block px-4 py-3 rounded-lg transition-colors ${
              isActive('/dashboard')
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            🛍️ Shop
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/orders"
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActive('/orders')
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                📋 Orders
              </Link>
              <Link
                to="/profile"
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActive('/profile')
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                👤 Profile
              </Link>
              <Link
                to="/settings"
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActive('/settings')
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                ⚙️ Settings
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <>
              <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
              <Link
                to="/admin"
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActive('/admin')
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                🔧 Admin
              </Link>
              <Link
                to="/analytics"
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActive('/analytics')
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                📊 Analytics
              </Link>
            </>
          )}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl">{theme === 'light' ? '🌙' : '☀️'}</span>
              <span>Theme</span>
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {theme}
            </span>
          </button>

          {/* Login/Logout */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 rounded-lg bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400 hover:bg-error-100 dark:hover:bg-error-900/30 transition-colors font-medium"
            >
              🚪 Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block w-full px-4 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium text-center"
            >
              🔐 Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
