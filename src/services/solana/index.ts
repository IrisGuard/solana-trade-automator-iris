
// Re-export key Solana services in a centralized file
import { fetchSOLBalance, getSolBalance } from './wallet/balance';
import { sendToken } from './wallet/transfer';
import { fetchAllTokenBalances, fetchTokenBalance, tokenService } from './token';
import { RPC_ENDPOINTS, API_ENDPOINTS } from './config';

// Create a centralized solanaService object for compatibility with existing code
export const solanaService = {
  fetchSOLBalance,
  getSolBalance,
  fetchAllTokenBalances,
  fetchTokenBalance,
  fetchTokenPrices: async (tokenAddress: string) => {
    // This is a wrapper for backward compatibility
    return { 
      price: 0, 
      priceChange24h: 0 
    };
  },
  fetchTransactions: async (address: string, limit: number = 10) => {
    // Stub implementation for backward compatibility
    console.log(`Would fetch ${limit} transactions for ${address}`);
    return [];
  },
  tokenService
};

// Re-export other modules
export { RPC_ENDPOINTS, API_ENDPOINTS };
export { tokenService };
