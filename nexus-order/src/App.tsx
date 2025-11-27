import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrderHistory } from './components/OrderHistory';
import { OrderDetail } from './pages/OrderDetail';
import type { Order } from './types';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

function App() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  // In a real app, get userId from auth context/store
  const userId = 'user-1';

  const handleOrderClick = (order: Order) => {
    setSelectedOrderId(order.id);
  };

  const handleBack = () => {
    setSelectedOrderId(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedOrderId ? (
            <OrderDetail orderId={selectedOrderId} onBack={handleBack} />
          ) : (
            <OrderHistory userId={userId} onOrderClick={handleOrderClick} />
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
