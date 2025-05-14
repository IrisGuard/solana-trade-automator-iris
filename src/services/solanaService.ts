
// This file now re-exports from the modularized structure
// for backwards compatibility
export { solanaService } from './solana';

// Also export the individual functions for direct access
export { fetchSOLBalance } from './solana/walletService';
export { fetchTokenBalance, fetchAllTokenBalances, fetchTokenPrices } from './solana/tokenService';
export { fetchTransactionHistory } from './solana/transaction';
