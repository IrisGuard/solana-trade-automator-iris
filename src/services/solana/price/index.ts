
import { fetchTokenPrices, getTokenPrice } from './fetchPrice';
import { setupPriceSubscription, cancelPriceSubscription, subscribeToPriceUpdates } from './subscription';

// Re-export types correctly with 'export type'
export type { TokenPriceData } from './types';

// Export individual functions
export {
  fetchTokenPrices,
  getTokenPrice,
  setupPriceSubscription,
  cancelPriceSubscription,
  subscribeToPriceUpdates
};

// Export price service object for backward compatibility
export const priceService = {
  getTokenPrice,
  fetchTokenPrices,
  setupPriceSubscription,
  cancelPriceSubscription,
  subscribeToPriceUpdates
};
