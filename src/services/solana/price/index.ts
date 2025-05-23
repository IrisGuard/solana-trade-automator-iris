
// Re-export functions
export { fetchTokenPrice } from './fetchPrice';
export { getTokenPriceHistory } from './priceHistory';
export { subscribeToPriceUpdates } from './subscription';

// Mock price service for compatibility
export const priceService = {
  fetchTokenPrice: async (tokenAddress: string) => {
    const { fetchTokenPrice } = await import('./fetchPrice');
    return fetchTokenPrice(tokenAddress);
  }
};

// Use export type for TypeScript types
export type { TokenPrice, TokenPrices } from '../token/types';
