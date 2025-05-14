
export { Token } from './types';
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
  }
};
