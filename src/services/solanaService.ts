
// This file now re-exports from the modularized structure
// for backwards compatibility
import { fetchSOLBalance } from './solana/wallet';
import { fetchTokenBalance, fetchAllTokenBalances, fetchTokenPrices } from './solana/token';
import { fetchTransactionHistory } from './solana/transaction';
import { walletService } from './solana/walletService';
import { tokenService } from './solana/token';
import { priceService } from './solana/price';
import { tradingService } from './solana';

// Create and export a combined solanaService object for backwards compatibility
export const solanaService = {
  fetchSOLBalance,
  fetchTokenBalance,
  fetchAllTokenBalances,
  fetchTokenPrices,
  fetchTransactionHistory
};

