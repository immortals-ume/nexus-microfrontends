import { useState } from 'react';
import { ProfilePage } from './components/ProfilePage';
import { AddressBook } from './components/AddressBook';
import { PaymentMethods } from './components/PaymentMethods';

type Tab = 'profile' | 'addresses' | 'payments';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Account Settings</h1>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`${
                activeTab === 'addresses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Addresses
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Payment Methods
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'profile' && <ProfilePage />}
          {activeTab === 'addresses' && <AddressBook />}
          {activeTab === 'payments' && <PaymentMethods />}
        </div>
      </div>
    </div>
  );
}

export default App;
