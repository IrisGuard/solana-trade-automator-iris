
import { HELIUS_API_BASE_URL, getHeliusApiKey } from './config';
import { handleHeliusError } from './errorHandler';

/**
 * Verify if the Helius connection is working
 */
export const verifyConnection = async (): Promise<boolean> => {
  try {
    const apiKey = getHeliusApiKey();
    // Just check if we can access the API with a simple request
    const url = `${HELIUS_API_BASE_URL}/status?api-key=${apiKey}`;
    
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    handleHeliusError(error, 'verifyConnection');
    return false;
  }
};
