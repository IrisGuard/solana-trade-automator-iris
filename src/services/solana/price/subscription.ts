
import { TokenPriceData } from './types';
import { getTokenPrice } from './fetchPrice';

// Subscribe to price updates for a token
export function setupPriceSubscription(
  tokenAddress: string,
  callback: (priceData: TokenPriceData) => void
): () => void {
  // In a real app, this would set up a websocket or polling mechanism
  const intervalId = setInterval(async () => {
    const price = await getTokenPrice(tokenAddress);
    callback(price);
  }, 10000); // Update every 10 seconds
  
  // Return unsubscribe function
  return () => clearInterval(intervalId);
}

// Cancel a price subscription
export function cancelPriceSubscription(unsubscribeFunction: () => void): void {
  if (typeof unsubscribeFunction === 'function') {
    unsubscribeFunction();
  }
}

// Alias for subscribeToPriceUpdates to maintain compatibility
export const subscribeToPriceUpdates = setupPriceSubscription;
