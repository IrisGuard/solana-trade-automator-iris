
// Export token related functions
import { fetchTokenBalance, fetchAllTokenBalances } from '../wallet/balance';
export { fetchTokenBalance, fetchAllTokenBalances };
export { fetchTokenPrices } from './prices';
export type { Token } from './types';

// Create a tokenService object for compatibility
export const tokenService = {
  getTokenBalance: fetchTokenBalance,
  getAllTokens: fetchAllTokenBalances,
  fetchTokenPrices
};
