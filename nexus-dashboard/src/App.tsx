import { Package, ShoppingBag, Heart, User, TrendingUp, Clock, CreditCard, MapPin } from 'lucide-react';
import './App.css';

function App() {
  // Mock data - in real app, this would come from API/store
  const recentOrders = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: 'Jan 25, 2024',
      total: 164.99,
      status: 'Processing',
      statusColor: 'bg-blue-100 text-blue-700',
      items: 1,
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: 'Jan 20, 2024',
      total: 115.97,
      status: 'Shipped',
      statusColor: 'bg-indigo-100 text-indigo-700',
      items: 2,
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      date: 'Jan 15, 2024',
      total: 439.98,
      status: 'Delivered',
      statusColor: 'bg-green-100 text-green-700',
      items: 2,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your account.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-green-600">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">24</h3>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-600">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">$2,847</h3>
            <p className="text-sm text-gray-600">Total Spent</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pink-100 rounded-lg">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">12</h3>
            <p className="text-sm text-gray-600">Wishlist Items</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Package className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">3</h3>
            <p className="text-sm text-gray-600">Active Orders</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Package className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {order.date}
                          </span>
                          <span className="text-sm text-gray-600">{order.items} items</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 mb-1">${order.total}</p>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Account Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all">
                  <ShoppingBag className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-gray-900">Browse Products</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all">
                  <Package className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-gray-900">Track Orders</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all">
                  <Heart className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-gray-900">View Wishlist</span>
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Profile Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Addresses</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Payment Methods</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
