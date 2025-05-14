
// This file now re-exports from the modularized structure
// for backwards compatibility

// Export the individual functions for direct access
export { fetchSOLBalance } from './solana/wallet';
export { fetchTokenBalance, fetchAllTokenBalances, fetchTokenPrices } from './solana/token';
export { fetchTransactionHistory } from './solana/transaction';

// Create and export a combined solanaService object for backwards compatibility
export const solanaService = {
  fetchSOLBalance: fetchSOLBalance,
  fetchTokenBalance: fetchTokenBalance,
  fetchAllTokenBalances: fetchAllTokenBalances,
  fetchTokenPrices: fetchTokenPrices,
  fetchTransactionHistory: fetchTransactionHistory
};
