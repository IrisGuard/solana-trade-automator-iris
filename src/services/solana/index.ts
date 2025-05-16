
// Re-export key Solana services in a centralized file
import { fetchSOLBalance, getSolBalance } from './wallet/balance';
import { sendToken, sendSOL, sendSPLToken } from './wallet/transfer';
import { fetchAllTokenBalances, fetchTokenBalance, tokenService } from './token';
import { priceService } from './priceService';
import { RPC_ENDPOINTS, API_ENDPOINTS } from './config';
import { jupiterService, swapTokens } from './jupiterService';

// Create a centralized solanaService object for compatibility with existing code
export const solanaService = {
  // Balance functions
  fetchSOLBalance,
  getSolBalance,
  fetchAllTokenBalances,
  fetchTokenBalance,
  tokenService,
  
  // Transfer functions
  sendToken,
  sendSOL,
  sendSPLToken,
  
  // Price functions
  fetchTokenPrices: priceService.fetchTokenPrices,
  getTokenPrice: priceService.getTokenPrice,
  
  // Jupiter integration
  jupiterService,
  swapTokens,
  
  // Transactions
  fetchTransactions: async (address: string, limit: number = 10) => {
    const heliusService = (await import('@/services/helius/HeliusService')).heliusService;
    return heliusService.fetchTransactions(address, limit);
  }
};

// Re-export other modules
export { RPC_ENDPOINTS, API_ENDPOINTS };
export { tokenService, fetchAllTokenBalances, fetchTokenBalance, priceService };
export { jupiterService };
export { sendToken, sendSOL, sendSPLToken };
