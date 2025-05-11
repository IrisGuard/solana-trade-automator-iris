
import { connection } from './config';
import { walletService } from './walletService';
import { tokenService } from './tokenService';
import { transactionService } from './transaction';

// Combine all services into a single exported object
export const solanaService = {
  // Re-export connection
  getConnection: () => connection,
  
  // Wallet functionality
  getSolBalance: walletService.getSolBalance,
  sendToken: walletService.sendToken,
  
  // Token functionality
  getTokenAccounts: tokenService.getTokenAccounts,
  getTokenPrice: tokenService.getTokenPrice,
  
  // Transaction functionality
  getRecentTransactions: transactionService.getRecentTransactions
};

