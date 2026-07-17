'use client';

import { useState, useEffect, useCallback } from 'react';
import { circleWalletService, EmployeeWallet, WalletBalance } from '@/lib/circle-api';
import { validateCircleConfig } from '@/config/circle-config';

export interface UseEmployeeWalletReturn {
  wallets: EmployeeWallet[];
  loading: boolean;
  error: string | null;
  refreshWallets: () => Promise<void>;
  getWalletBalance: (walletId: string) => Promise<WalletBalance | null>;
  createWallet: (employeeId: string, walletName?: string) => Promise<EmployeeWallet | null>;
}

export const useEmployeeWallet = (employeeId: string): UseEmployeeWalletReturn => {
  const [wallets, setWallets] = useState<EmployeeWallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshWallets = useCallback(async () => {
    if (!validateCircleConfig()) {
      setError('Circle API not configured');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const employeeWallets = await circleWalletService.getEmployeeWallets(employeeId);
      setWallets(employeeWallets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallets');
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  const getWalletBalance = useCallback(async (walletId: string): Promise<WalletBalance | null> => {
    if (!validateCircleConfig()) {
      setError('Circle API not configured');
      return null;
    }

    try {
      return await circleWalletService.getEmployeeWalletBalance(employeeId, walletId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet balance');
      return null;
    }
  }, [employeeId]);

  const createWallet = useCallback(async (employeeId: string, walletName?: string): Promise<EmployeeWallet | null> => {
    if (!validateCircleConfig()) {
      setError('Circle API not configured');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const newWallet = await circleWalletService.createEmployeeWallet(employeeId, walletName);
      if (newWallet) {
        setWallets(prev => [...prev, newWallet]);
      }
      return newWallet;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create wallet');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (employeeId) {
      refreshWallets();
    }
  }, [employeeId, refreshWallets]);

  return {
    wallets,
    loading,
    error,
    refreshWallets,
    getWalletBalance,
    createWallet
  };
};

export default useEmployeeWallet;
