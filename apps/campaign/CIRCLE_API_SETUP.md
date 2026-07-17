# Circle API Integration for Employee Wallets

This integration allows you to manage employee wallet balances using Circle's API from Coinbase.

## Setup Instructions

### 1. Get Circle API Key

1. Visit [Circle Developer Portal](https://developers.circle.com/)
2. Create an account or sign in
3. Create a new project
4. Generate an API key
5. Copy your API key

### 2. Environment Configuration

Create a `.env.local` file in your project root:

```bash
# Circle API Configuration
CIRCLE_API_KEY=your_actual_api_key_here
CIRCLE_ENVIRONMENT=sandbox
```

**Important:** 
- Use `sandbox` for testing
- Use `production` for live environment
- Never commit your actual API key to version control

### 3. Install Dependencies

The Circle SDK has already been installed:

```bash
npm install @circle-fin/circle-sdk
```

### 4. Usage Examples

#### Basic Usage in a Component

```tsx
import EmployeeWalletCard from '@/components/EmployeeWalletCard';

function EmployeeDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <EmployeeWalletCard 
        employeeId="emp_001" 
        employeeName="John Doe"
        onWalletCreated={(walletId) => {
          console.log('New wallet created:', walletId);
        }}
      />
    </div>
  );
}
```

#### Using the Hook Directly

```tsx
import { useEmployeeWallet } from '@/hooks/useEmployeeWallet';

function CustomWalletComponent() {
  const { wallets, loading, error, refreshWallets } = useEmployeeWallet('emp_001');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {wallets.map(wallet => (
        <div key={wallet.walletId}>
          Balance: {wallet.balance.balance} {wallet.balance.currency}
        </div>
      ))}
    </div>
  );
}
```

#### Using the Service Directly

```tsx
import { circleWalletService } from '@/lib/circle-api';

async function getEmployeeBalance(employeeId: string, walletId: string) {
  try {
    const balance = await circleWalletService.getEmployeeWalletBalance(employeeId, walletId);
    console.log('Balance:', balance);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Features

- ✅ **Wallet Management**: Create and manage employee wallets
- ✅ **Balance Tracking**: Real-time balance updates
- ✅ **Privacy Controls**: Hide/show balance functionality
- ✅ **Transaction History**: View wallet transaction history
- ✅ **Multiple Currencies**: Support for different currencies
- ✅ **Error Handling**: Comprehensive error handling
- ✅ **TypeScript Support**: Full TypeScript support

## API Endpoints Used

- `GET /v1/wallets` - List wallets
- `GET /v1/wallets/{id}` - Get wallet details
- `POST /v1/wallets` - Create new wallet
- `GET /v1/wallets/{id}/transactions` - Get wallet transactions

## Security Notes

- Always use environment variables for API keys
- Never expose API keys in client-side code
- Use sandbox environment for testing
- Implement proper error handling
- Consider rate limiting for production use

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the key is correct
   - Check if you're using the right environment (sandbox vs production)
   - Ensure the key has proper permissions

2. **Network Errors**
   - Check your internet connection
   - Verify Circle API status
   - Check for CORS issues in browser

3. **Balance Not Updating**
   - Call `refreshWallets()` to manually refresh
   - Check if the wallet ID is correct
   - Verify the employee ID exists

### Support

- [Circle API Documentation](https://developers.circle.com/docs)
- [Circle Support](https://support.circle.com/)
