
import { apiKeys } from '../apiConfig';

// Define the base URL for Helius API
export const HELIUS_BASE_URL = 'https://api.helius.xyz/v0';

/**
 * Get a valid Helius API key from the configured keys
 */
export const getHeliusApiKey = (): string => {
  // If we have specific API keys for Helius, use them
  if (apiKeys && apiKeys.helius && apiKeys.helius.length > 0) {
    return apiKeys.helius[Math.floor(Math.random() * apiKeys.helius.length)];
  }
  
  // Fallback to demo key
  return 'demo-key';
};
