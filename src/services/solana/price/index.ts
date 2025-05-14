
// Export all price related functionality

import { fetchTokenPriceFromAPI, fetchAllPricesFromAPI } from './fetchPrice';
import { setupPriceSubscription, cancelPriceSubscription } from './subscription';
import type { PriceData, PriceSubscriptionConfig, TokenPriceMap } from './types';

// Re-export functions for direct use
export const fetchTokenPrice = fetchTokenPriceFromAPI;
export const fetchTokenPrices = fetchAllPricesFromAPI;
export const getTokenPrice = fetchTokenPriceFromAPI; // Alias for backward compatibility
export const subscribeToPriceUpdates = setupPriceSubscription; 
export const unsubscribeFromPriceUpdates = cancelPriceSubscription;

// Export types
export type { PriceData, PriceSubscriptionConfig, TokenPriceMap };

// Export service object for backward compatibility
export const priceService = {
  fetchTokenPrice: fetchTokenPriceFromAPI,
  fetchTokenPrices: fetchAllPricesFromAPI,
  getTokenPrice: fetchTokenPriceFromAPI,
  subscribeToPriceUpdates: setupPriceSubscription,
  unsubscribeFromPriceUpdates: cancelPriceSubscription
};

// Export default as the service for named imports
export default priceService;
