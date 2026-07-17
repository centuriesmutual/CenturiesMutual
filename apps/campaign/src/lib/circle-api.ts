// Rails API service for wallet management
// This service communicates with a Ruby on Rails backend

export interface WalletBalance {
  walletId: string;
  balance: string;
  currency: string;
  availableBalance: string;
  frozenBalance: string;
}

export interface EmployeeWallet {
  employeeId: string;
  walletId: string;
  walletAddress: string;
  balance: WalletBalance;
  lastUpdated: Date;
}

const getApiUrl = () => {
  return process.env.RAILS_API_URL || process.env.NEXT_PUBLIC_RAILS_API_URL || 'http://localhost:3000/api';
};

export class CircleWalletService {
  private apiUrl: string;

  constructor(apiUrl?: string) {
    this.apiUrl = apiUrl || getApiUrl();
  }

  /**
   * Get wallet balance for an employee
   */
  async getEmployeeWalletBalance(employeeId: string, walletId: string): Promise<WalletBalance | null> {
    try {
      const response = await fetch(`${this.apiUrl}/employees/${employeeId}/wallets/${walletId}/balance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch wallet balance: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      throw new Error('Failed to fetch wallet balance');
    }
  }

  /**
   * Get all wallets for an employee
   */
  async getEmployeeWallets(employeeId: string): Promise<EmployeeWallet[]> {
    try {
      const response = await fetch(`${this.apiUrl}/employees/${employeeId}/wallets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch employee wallets: ${response.statusText}`);
      }

      const data = await response.json();
      // Transform the response to match EmployeeWallet interface
      return data.map((wallet: any) => ({
        employeeId: wallet.employee_id || employeeId,
        walletId: wallet.wallet_id || wallet.id,
        walletAddress: wallet.wallet_address || wallet.address || '',
        balance: {
          walletId: wallet.wallet_id || wallet.id,
          balance: wallet.balance?.balance || wallet.balance || '0',
          currency: wallet.balance?.currency || wallet.currency || 'USD',
          availableBalance: wallet.balance?.available_balance || wallet.available_balance || wallet.balance || '0',
          frozenBalance: wallet.balance?.frozen_balance || wallet.frozen_balance || '0',
        },
        lastUpdated: wallet.last_updated ? new Date(wallet.last_updated) : new Date(),
      }));
    } catch (error) {
      console.error('Error fetching employee wallets:', error);
      throw new Error('Failed to fetch employee wallets');
    }
  }

  /**
   * Create a new wallet for an employee
   */
  async createEmployeeWallet(employeeId: string, walletName?: string): Promise<EmployeeWallet | null> {
    try {
      const response = await fetch(`${this.apiUrl}/employees/${employeeId}/wallets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: walletName || `Employee ${employeeId} Wallet`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create wallet: ${response.statusText}`);
      }

      const wallet = await response.json();
      return {
        employeeId: wallet.employee_id || employeeId,
        walletId: wallet.wallet_id || wallet.id,
        walletAddress: wallet.wallet_address || wallet.address || '',
        balance: {
          walletId: wallet.wallet_id || wallet.id,
          balance: wallet.balance?.balance || '0',
          currency: wallet.balance?.currency || wallet.currency || 'USD',
          availableBalance: wallet.balance?.available_balance || wallet.available_balance || '0',
          frozenBalance: wallet.balance?.frozen_balance || wallet.frozen_balance || '0',
        },
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error('Error creating employee wallet:', error);
      throw new Error('Failed to create employee wallet');
    }
  }

  /**
   * Get transaction history for an employee wallet
   */
  async getWalletTransactions(walletId: string, limit: number = 50): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiUrl}/wallets/${walletId}/transactions?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }

      const data = await response.json();
      return data.transactions || data || [];
    } catch (error) {
      console.error('Error fetching wallet transactions:', error);
      throw new Error('Failed to fetch wallet transactions');
    }
  }

  /**
   * Format currency amount for display
   */
  formatCurrency(amount: string, currency: string = 'USD'): string {
    const numericAmount = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(numericAmount);
  }
}

// Export singleton instance
export const circleWalletService = new CircleWalletService();

export default circleWalletService;
