
// Re-export solana services for consistent access
import { fetchTokenBalance, fetchAllTokenBalances } from './tokenService';
import { fetchSOLBalance } from './walletService';
import { fetchTransactionHistory } from './transaction';
import { fetchTokenPrices } from './priceService';

// For backward compatibility with existing code
import { walletService } from './walletService';
import { tokenService } from './tokenService';
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
  fetchTokenPrices,
  
  // Backward compatibility properties
  getConnection: () => connection,
  getSolBalance: walletService.getSolBalance,
  getTokenAccounts: tokenService.getTokenAccounts,
  getTokenPrice: tokenService.getTokenPrice,
  getRecentTransactions: transactionService.getRecentTransactions,
  raydium: raydiumService,
  trading: tradingService
};
