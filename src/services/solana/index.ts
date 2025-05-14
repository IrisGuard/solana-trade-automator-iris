
// Export individual functions from each module
import { fetchSOLBalance } from './wallet';
import { fetchTokenBalance, fetchAllTokenBalances, fetchTokenPrices as fetchTokenPricesFromToken } from './token';
import { fetchTransactionHistory } from './transaction';
import { getTokenPrice, fetchTokenPrices as fetchTokenPricesFromPrice, priceService } from './price';

// Import services for backward compatibility
import { walletService } from './wallet';
import { tokenService } from './token';
import { transactionService } from './transaction';
import { raydiumService } from './raydiumService';
import { tradingService } from './tradingService';
import { connection } from './config';

// Export a standard interface for the modular approach
export const solanaService = {
  // New modular functions
  fetchTokenBalance,
  fetchAllTokenBalances,
  fetchSOLBalance,
  fetchTransactionHistory,
  fetchTokenPrices: fetchTokenPricesFromPrice,
  
  // Backward compatibility properties
  getConnection: () => connection,
  getSolBalance: walletService.getSolBalance,
  getTokenAccounts: tokenService.getTokenAccounts,
  getTokenPrice: priceService.getTokenPrice,
  getRecentTransactions: transactionService.getRecentTransactions,
  raydium: raydiumService,
  trading: tradingService
};
