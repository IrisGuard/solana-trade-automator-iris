
import { HELIUS_BASE_URL, getHeliusApiKey } from './config';
import { handleHeliusError } from './errorHandler';

/**
 * Get all assets owned by an address
 */
export const getAddressAssets = async (address: string): Promise<any> => {
  try {
    const apiKey = getHeliusApiKey();
    const url = `${HELIUS_BASE_URL}/addresses/${address}/balances?api-key=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    handleHeliusError(error, 'getAddressAssets');
  }
};

/**
 * Get NFT events by address
 */
export const getNftEvents = async (address: string, options?: { limit?: number }): Promise<any[]> => {
  try {
    const apiKey = getHeliusApiKey();
    const limit = options?.limit || 100;
    const url = `${HELIUS_BASE_URL}/nft-events?api-key=${apiKey}&sourceAddress=${address}&limit=${limit}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    handleHeliusError(error, 'getNftEvents');
  }
};
