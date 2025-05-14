
import { fetchTokenBalance, fetchAllTokenBalances } from './balance';
import { getTokenAccounts, getParsedTokenAccounts } from './tokenAccounts';

// Create the tokenService object with necessary methods
export const tokenService = {
  getTokenAccounts,
  getParsedTokenAccounts,
  getTokenPrice: async (tokenAddress: string): Promise<number> => {
    // This is a placeholder implementation
    return Math.random() * 100; // Return a random price for now
  },
  fetchTokenBalance,
  fetchAllTokenBalances
};

// Export individual functions
export {
  fetchTokenBalance,
  fetchAllTokenBalances,
  getTokenAccounts,
  getParsedTokenAccounts
};
