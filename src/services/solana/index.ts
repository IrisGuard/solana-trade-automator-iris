
// Re-export solana services for consistent access
import { fetchTokenBalance, fetchAllTokenBalances } from './tokenService';
import { fetchSOLBalance } from './walletService';
import { fetchTransactionHistory } from './transaction';
import { fetchTokenPrices } from './priceService';

export const solanaService = {
  fetchTokenBalance,
  fetchAllTokenBalances,
  fetchSOLBalance,
  fetchTransactionHistory,
  fetchTokenPrices,
};
