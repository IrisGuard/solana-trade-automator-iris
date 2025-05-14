
import { TokenPriceData } from './types';
export { TokenPriceData } from './types';
import { getTokenPrice, fetchTokenPrices } from './fetchPrice';
import { subscribeToPriceUpdates } from './subscription';

// Export services
export const priceService = {
  getTokenPrice,
  subscribeToPriceUpdates,
  fetchTokenPrices
};

// Export individual functions for direct imports
export {
  getTokenPrice,
  fetchTokenPrices,
  subscribeToPriceUpdates
};
