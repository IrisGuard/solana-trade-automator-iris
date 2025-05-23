
import { fetchTokenPrice } from './fetchPrice';

export function subscribeToPriceUpdates(
  tokenAddress: string, 
  callback: (price: number) => void
): () => void {
  const interval = setInterval(async () => {
    try {
      const priceData = await fetchTokenPrice(tokenAddress);
      callback(priceData.price);
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  }, 30000); // Update every 30 seconds

  return () => clearInterval(interval);
}
