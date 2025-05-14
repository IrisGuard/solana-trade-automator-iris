
// Re-export types correctly with 'export type'
export type { Token } from './types';

import { fetchTokenBalance, fetchAllTokenBalances } from './balance';
import { fetchTokenPrices } from './prices';

// Export individual functions
export {
  fetchTokenBalance,
  fetchAllTokenBalances,
  fetchTokenPrices
};

// Export token service object for backward compatibility
export const tokenService = {
  getTokenAccounts: fetchAllTokenBalances,
  getTokenPrice: async (tokenAddress: string): Promise<number> => {
    const prices = await fetchTokenPrices([tokenAddress]);
    return prices[tokenAddress] || 0;
  },
  // Add getTokenBalance method that was missing
  getTokenBalance: async (address: string, tokenAddress: string): Promise<number> => {
    try {
      const tokenData = await fetchTokenBalance(address, tokenAddress);
      return tokenData.amount || 0;
    } catch (error) {
      console.error("Error fetching token balance:", error);
      return 0;
    }
  }
};
