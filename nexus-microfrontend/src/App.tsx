import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import './App.css'
import ErrorBoundary from './components/ErrorBoundary'
import { Header } from './components/Header'
import { MobileMenu } from './components/MobileMenu'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ToastContainer } from './components/ui/Toast'
import { GlobalLoadingBar } from './components/ui/LoadingState'
import { useStore } from './store'
// @ts-ignore
const AuthApp = lazy(() => import('auth/App'))
// @ts-ignore
const ProductApp = lazy(() => import('product/App'))
// @ts-ignore
const DashboardApp = lazy(() => import('dashboard/App'))
// @ts-ignore
const AdminApp = lazy(() => import('admin/App'))
// @ts-ignore
const AnalyticsApp = lazy(() => import('analytics/App'))
// @ts-ignore
const CartDrawer = lazy(() => import('cart/CartDrawer'))

const LoadingFallback = ({ name }: { name: string }) => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <div className="spinner" />
    <p>Loading {name}…</p>
  </div>
)

function AppContent() {
  const navigate = useNavigate();
  const isCartOpen = useStore((state) => state.ui.isCartOpen);
  const setCartOpen = useStore((state) => state.ui.setCartOpen);
  const isGlobalLoading = useStore((state) => state.ui.isGlobalLoading);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    setCartOpen(false);
  };

  return (
    <>
      <GlobalLoadingBar isLoading={isGlobalLoading} />
      <div className="app-container">
        <Header />
        <MobileMenu />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login/*"   element={
                <ErrorBoundary name="Auth">
                  <Suspense fallback={<LoadingFallback name="Auth" />}>
                    <AuthApp />
                  </Suspense>
                </ErrorBoundary>
              }/>
            <Route
              path="/products/*"
              element={
                <ErrorBoundary name="Products">
                  <Suspense fallback={<LoadingFallback name="Products" />}>
                    <ProductApp />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="/dashboard/*"
              element={
                <ErrorBoundary name="Dashboard">
                  <Suspense fallback={<LoadingFallback name="Dashboard" />}>
                    <DashboardApp />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ErrorBoundary name="Admin">
                    <Suspense fallback={<LoadingFallback name="Admin" />}>
                      <AdminApp />
                    </Suspense>
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics/*"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ErrorBoundary name="Analytics">
                    <Suspense fallback={<LoadingFallback name="Analytics" />}>
                      <AnalyticsApp />
                    </Suspense>
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>

      {/* Cart Drawer */}
      <ErrorBoundary name="Cart">
        <Suspense fallback={null}>
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setCartOpen(false)}
            useStore={useStore}
            onCheckout={handleCheckout}
            onContinueShopping={handleContinueShopping}
          />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <ToastContainer />
    </BrowserRouter>
  )
}

function Home() {
  return (
    <div className="home">
      <h2>Welcome to Nexus Micro Frontend Architecture</h2>
      <p>FAANG-level micro frontend setup with React + Vite + Module Federation</p>
      <div className="features">
        <div className="feature-card">
          <h3>🛍️ Products</h3>
          <p>Product catalog micro frontend - Browse, search, and filter products</p>
          <span className="badge">Port 5173</span>
          <a href="/products" className="feature-link">View Products →</a>
        </div>
        <div className="feature-card">
          <h3>🎯 Dashboard</h3>
          <p>Main dashboard micro frontend - Independently deployed</p>
          <span className="badge">Port 5173</span>
        </div>
        <div className="feature-card">
          <h3>⚙️ Admin</h3>
          <p>Admin panel micro frontend - Independently deployed</p>
          <span className="badge">Port 5174</span>
        </div>
        <div className="feature-card">
          <h3>📊 Analytics</h3>
          <p>Analytics micro frontend - Independently deployed</p>
          <span className="badge">Port 5175</span>
        </div>
      </div>
      <div className="architecture-info">
        <h3>✨ FAANG-Level Features</h3>
        <ul>
          <li>✅ Runtime Module Federation</li>
          <li>✅ Error Boundaries per Microfrontend</li>
          <li>✅ Lazy Loading with Suspense</li>
          <li>✅ React Router Integration</li>
          <li>✅ Independent Deployment Ready</li>
          <li>✅ Graceful Failure Handling</li>
        </ul>
      </div>
    </div>
  )
}

export default App
