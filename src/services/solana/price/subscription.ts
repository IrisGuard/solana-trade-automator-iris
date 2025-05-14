
import { TokenPriceData } from './types';
import { getTokenPrice } from './fetchPrice';

// Subscribe to price updates for a token
export function subscribeToPriceUpdates(
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
