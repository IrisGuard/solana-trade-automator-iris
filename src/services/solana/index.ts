
// Re-export key Solana services in a centralized file
import { fetchSOLBalance, getSolBalance } from './wallet/balance';
import { sendToken } from './wallet/transfer';
import { fetchAllTokenBalances, fetchTokenBalance, tokenService } from './token';
import { priceService } from './price';
import { RPC_ENDPOINTS, API_ENDPOINTS } from './config';

// Create a centralized solanaService object for compatibility with existing code
export const solanaService = {
  fetchSOLBalance,
  getSolBalance,
  fetchAllTokenBalances,
  fetchTokenBalance,
  tokenService,
  fetchTokenPrices: async (tokenAddress: string) => {
    return { 
      price: 0, 
      priceChange24h: 0 
    };
  },
  fetchTransactions: async (address: string, limit: number = 10) => {
    console.log(`Would fetch ${limit} transactions for ${address}`);
    return [];
  }
};

// Re-export other modules
export { RPC_ENDPOINTS, API_ENDPOINTS };
export { tokenService, fetchAllTokenBalances, fetchTokenBalance, priceService };
