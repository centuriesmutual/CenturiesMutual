'use client';

import { useState } from 'react';
import {
  WalletIcon,
  PlusIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useEmployeeWallet } from '@/hooks/useEmployeeWallet';
import { circleWalletService } from '@/lib/circle-api';

interface EmployeeWalletCardProps {
  employeeId: string;
  employeeName: string;
  onWalletCreated?: (walletId: string) => void;
}

export default function EmployeeWalletCard({ 
  employeeId, 
  employeeName, 
  onWalletCreated 
}: EmployeeWalletCardProps) {
  const { wallets, loading, error, refreshWallets, createWallet } = useEmployeeWallet(employeeId);
  const [showBalances, setShowBalances] = useState(true);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  const handleCreateWallet = async () => {
    setIsCreatingWallet(true);
    try {
      const newWallet = await createWallet(employeeId, `${employeeName}'s Wallet`);
      if (newWallet && onWalletCreated) {
        onWalletCreated(newWallet.walletId);
      }
    } catch (err) {
      console.error('Failed to create wallet:', err);
    } finally {
      setIsCreatingWallet(false);
    }
  };

  const formatBalance = (amount: string, currency: string = 'USD') => {
    return circleWalletService.formatCurrency(amount, currency);
  };

  if (loading && wallets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <WalletIcon className="h-6 w-6 text-indigo-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{employeeName}</h3>
            <p className="text-sm text-gray-500">Employee ID: {employeeId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="p-2 text-gray-400 hover:text-gray-600"
            title={showBalances ? 'Hide Balances' : 'Show Balances'}
          >
            {showBalances ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
          <button
            onClick={refreshWallets}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            title="Refresh Wallets"
          >
            <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {wallets.length === 0 ? (
        <div className="text-center py-8">
          <WalletIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Wallets Found</h4>
          <p className="text-sm text-gray-500 mb-4">
            This employee doesn't have any wallets yet.
          </p>
          <button
            onClick={handleCreateWallet}
            disabled={isCreatingWallet}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingWallet ? (
              <>
                <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Wallet
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {wallets.map((wallet) => (
            <div key={wallet.walletId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Wallet {wallet.walletId.slice(-8)}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <ClockIcon className="h-3 w-3" />
                  <span>Updated {wallet.lastUpdated.toLocaleTimeString()}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Available Balance</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {showBalances ? formatBalance(wallet.balance.availableBalance, wallet.balance.currency) : '••••••'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Currency</p>
                  <p className="text-sm font-medium text-gray-700">{wallet.balance.currency}</p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Address: {wallet.walletAddress ? `${wallet.walletAddress.slice(0, 8)}...${wallet.walletAddress.slice(-8)}` : 'N/A'}
                </p>
              </div>
            </div>
          ))}
          
          <button
            onClick={handleCreateWallet}
            disabled={isCreatingWallet}
            className="w-full mt-4 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingWallet ? (
              <>
                <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                Creating New Wallet...
              </>
            ) : (
              <>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Another Wallet
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
