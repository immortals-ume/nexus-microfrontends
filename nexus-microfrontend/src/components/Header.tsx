import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { useState } from 'react';

/**
 * Header Component
 * 
 * Main navigation header with:
 * - Logo and navigation links
 * - Search bar
 * - Cart icon with item count badge
 * - User menu with login/logout
 * - Theme toggle
 * - Mobile menu button
 * 
 * Integrates with Zustand store for cart count and auth state.
 * Responsive design with mobile menu for small screens.
 */
export function Header() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Get state from Zustand store
  const { itemCount } = useStore((state) => state.cart);
  const { isAuthenticated, user } = useStore((state) => state.auth);
  const { theme, setTheme, toggleMobileMenu } = useStore((state) => state.ui);
  const toggleCart = useStore((state) => state.ui.toggleCart);
  const logout = useStore((state) => state.auth.logout);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products with search query
      window.location.href = `/dashboard/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo and Brand */}
        <div className="header-brand">
          <Link to="/" className="logo">
            <span className="logo-icon">🛍️</span>
            <span className="logo-text">Nexus</span>
          </Link>
        </div>

        {/* Main Navigation - Hidden on mobile */}
        <nav className="nav hidden lg:flex">
          <Link to="/" className={isActive('/') ? 'nav-link active' : 'nav-link'}>
            Home
          </Link>
          <Link to="/products" className={isActive('/products') ? 'nav-link active' : 'nav-link'}>
            Products
          </Link>
          <Link to="/dashboard" className={isActive('/dashboard') ? 'nav-link active' : 'nav-link'}>
            Shop
          </Link>
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className={isActive('/admin') ? 'nav-link active' : 'nav-link'}>
              Admin
            </Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/analytics" className={isActive('/analytics') ? 'nav-link active' : 'nav-link'}>
              Analytics
            </Link>
          )}
        </nav>

        {/* Search Bar - Hidden on small mobile */}
        <form className="search-bar hidden sm:flex" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search products"
          />
          <button type="submit" className="search-button" aria-label="Search">
            🔍
          </button>
        </form>

        {/* Right Side Actions */}
        <div className="header-actions">
          {/* Theme Toggle - Hidden on mobile */}
          <button
            onClick={toggleTheme}
            className="icon-button hidden md:flex"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* Cart Icon with Badge */}
          <button
            onClick={toggleCart}
            className="icon-button cart-button"
            aria-label={`Shopping cart with ${itemCount} items`}
            title="View cart"
          >
            <span className="cart-icon">🛒</span>
            {itemCount > 0 && (
              <span className="cart-badge" aria-label={`${itemCount} items in cart`}>
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          {/* User Menu - Hidden on mobile */}
          <div className="user-menu-container hidden lg:block">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="icon-button user-button"
                  aria-label="User menu"
                  aria-expanded={showUserMenu}
                >
                  <span className="user-icon">👤</span>
                  <span className="user-name">{user?.firstName || 'User'}</span>
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      to="/settings"
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Settings
                    </Link>
                    <hr className="dropdown-divider" />
                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout-button"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="login-button">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button - Visible only on mobile */}
          <button
            onClick={toggleMobileMenu}
            className="icon-button lg:hidden"
            aria-label="Open mobile menu"
            title="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
