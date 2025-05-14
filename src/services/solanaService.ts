
// This file re-exports all Solana service functionality
import { walletService } from './solana/walletService';
import { tokenService } from './solana/tokenService';
import { priceService } from './solana/priceService';
import { transactionService } from './solana/transaction';

// Create a combined service for easier access
export const solanaService = {
  // Wallet Methods
  connectWallet: walletService.getConnection,
  disconnectWallet: () => Promise.resolve(true), // No explicit disconnect in walletService
  fetchSOLBalance: walletService.getSolBalance,
  
  // Token Methods
  fetchTokenBalance: tokenService.getTokenAccounts,
  fetchAllTokenBalances: tokenService.getTokenAccounts,
  fetchTokenPrices: priceService.getTokenPrice,
  
  // Transaction Methods
  fetchTransactionHistory: transactionService.getRecentTransactions,
  parseTransaction: transactionService.parseTransaction,
  
  // Re-export individual services for direct access if needed
  wallet: walletService,
  token: tokenService,
  price: priceService,
  transaction: transactionService
};

// Export the combined service as default
export default solanaService;
