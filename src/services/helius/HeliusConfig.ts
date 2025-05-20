
// Helius API configuration

// Fallback key for development (should be replaced with user's key in production)
export const FALLBACK_HELIUS_KEY = "your-fallback-helius-dev-key";

// Default Helius RPC endpoint
export const HELIUS_RPC_URL = "https://api.helius.xyz/v0";

// Configuration object for Helius service
export const HELIUS_CONFIG = {
  useLocalStorage: true,        // Whether to cache API keys in localStorage
  localStorageKey: "helius_api_key",
  maxConcurrentRequests: 5,     // Rate limiting
  requestTimeout: 30000,        // 30 seconds timeout
  retryAttempts: 2,             // Number of retry attempts for failed requests
  defaultNetwork: "mainnet"     // Default network to use
};

export default {
  FALLBACK_HELIUS_KEY,
  HELIUS_RPC_URL,
  HELIUS_CONFIG
};
