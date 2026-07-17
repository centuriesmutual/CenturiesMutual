'use client';

import { useState } from 'react';
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CreditCardIcon,
  PlusIcon,
  MinusIcon,
  EyeIcon,
  EyeSlashIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

export default function AccountBalancePage() {
  const [showBalance, setShowBalance] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);

  // Sample account data
  const accountData = {
    currentBalance: 18400.50,
    previousBalance: 16200.75,
    totalEarnings: 28400.25,
    totalSpent: 9999.75,
    pendingAmount: 1250.00,
  };

  const transactions = [
    { id: 1, type: 'credit', amount: 2500.00, description: 'Campaign Revenue - Q4 Marketing', date: '2024-01-21', status: 'completed' },
    { id: 2, type: 'debit', amount: -450.00, description: 'Ad Spend - Facebook Campaign', date: '2024-01-20', status: 'completed' },
    { id: 3, type: 'credit', amount: 1800.00, description: 'Content Monetization', date: '2024-01-19', status: 'completed' },
    { id: 4, type: 'debit', amount: -320.00, description: 'Google Ads Budget', date: '2024-01-18', status: 'completed' },
    { id: 5, type: 'credit', amount: 1250.00, description: 'Affiliate Commission', date: '2024-01-17', status: 'pending' },
    { id: 6, type: 'debit', amount: -150.00, description: 'Software Subscription', date: '2024-01-16', status: 'completed' },
    { id: 7, type: 'credit', amount: 3200.00, description: 'Brand Partnership', date: '2024-01-15', status: 'completed' },
    { id: 8, type: 'debit', amount: -280.00, description: 'Design Tools License', date: '2024-01-14', status: 'completed' },
  ];

  const balanceChange = accountData.currentBalance - accountData.previousBalance;
  const balanceChangePercent = ((balanceChange / accountData.previousBalance) * 100).toFixed(1);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <BanknotesIcon className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Account Balance</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 text-gray-400 hover:text-gray-600"
                title={showBalance ? 'Hide Balance' : 'Show Balance'}
              >
                {showBalance ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Balance */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
              <div className="flex items-center space-x-2">
                <button 
                  className="flex items-center space-x-1 text-xs text-green-600 hover:text-green-700 transition-colors"
                  title="View detailed earnings reports and analytics"
                >
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                  <span>Reports</span>
                </button>
                <button 
                  className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                  title="Transfer funds to your bank account"
                >
                  <BanknotesIcon className="h-4 w-4" />
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {showBalance ? formatCurrency(accountData.currentBalance) : '••••••'}
            </div>
            <div className="flex items-center text-sm">
              {balanceChange >= 0 ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={balanceChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                {showBalance ? `${balanceChange >= 0 ? '+' : ''}${formatCurrency(balanceChange)} (${balanceChangePercent}%)` : '••••••'}
              </span>
            </div>
          </div>

          {/* Meta Ad Credits */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium text-gray-500">Meta Ad Credits</h3>
                <button 
                  onClick={() => setShowBuyCreditsModal(true)}
                  className="p-1 hover:bg-gray-100 rounded-md transition-colors" 
                  title="Buy More Credits"
                >
                  <PlusIcon className="h-4 w-4 text-blue-600" />
                </button>
              </div>
              <div className="flex items-center">
                <img 
                  src="/metalogo.png" 
                  alt="Meta Logo" 
                  className="h-6 w-6"
                />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {showBalance ? '$0.00' : '••••••'}
            </div>
            <div className="flex items-center text-sm">
              <span className="text-gray-600">Available for article promotion</span>
            </div>
          </div>

          {/* Earnings Graph */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Earnings Overview</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Period:</span>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white"
                >
                  <option value="1d">Today</option>
                  <option value="7d">This Week</option>
                  <option value="30d">This Month</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
            
            {/* Sample earnings data for different periods */}
            <div className="space-y-4">
              {selectedPeriod === '1d' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Today's Earnings</span>
                    <span className="text-lg font-semibold text-green-600">
                      {showBalance ? formatCurrency(1250.00) : '••••••'}
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500">+12% from yesterday</p>
                </div>
              )}
              
              {selectedPeriod === '7d' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">This Week's Earnings</span>
                    <span className="text-lg font-semibold text-green-600">
                      {showBalance ? formatCurrency(8750.00) : '••••••'}
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500">+8% from last week</p>
                </div>
              )}
              
              {selectedPeriod === '30d' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">This Month's Earnings</span>
                    <span className="text-lg font-semibold text-green-600">
                      {showBalance ? formatCurrency(28400.25) : '••••••'}
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500">+15% from last month</p>
                </div>
              )}
              
              {selectedPeriod === 'all' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Earnings</span>
                    <span className="text-lg font-semibold text-green-600">
                      {showBalance ? formatCurrency(28400.25) : '••••••'}
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500">All time earnings</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Intelligence */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CpuChipIcon className="h-6 w-6 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">Intelligence</h2>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Period:</span>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="all">All time</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-3 ${
                          transaction.type === 'credit' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? (
                            <PlusIcon className="h-4 w-4" />
                          ) : (
                            <MinusIcon className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                          <div className="text-sm text-gray-500">
                            {transaction.type === 'credit' ? 'Income' : 'Expense'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {showBalance ? formatCurrency(transaction.amount) : '••••••'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing 1-8 of 8 transactions
              </p>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <span className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md">
                  1 of 1
                </span>
                <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Buy Meta Credits Modal */}
      {showBuyCreditsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Buy Meta Ad Credits</h3>
                <button
                  onClick={() => setShowBuyCreditsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credit Amount
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Articles to Promote
                  </label>
                  <input
                    type="number"
                    placeholder="Number of articles"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCardIcon className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Admin Processing</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Your credits will be sent to the admin who will handle the Meta Ads promotion for your articles.
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowBuyCreditsModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle purchase logic here
                    setShowBuyCreditsModal(false);
                    // Show success message or redirect
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Purchase Credits
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
