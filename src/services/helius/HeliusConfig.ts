
// Fallback API key for development
export const FALLBACK_HELIUS_KEY = "";

// API Base URL
export const HELIUS_API_BASE_URL = "https://api.helius.xyz/v0";

// Rate limiting configuration
export const HELIUS_RATE_LIMITS = {
  MAX_REQUESTS_PER_MINUTE: 60,
  MAX_REQUESTS_PER_DAY: 10000,
  RETRY_AFTER_MS: 60 * 1000, // 1 minute
};

// Default network
export const DEFAULT_NETWORK = "mainnet-beta";

// Stale time for data (used in react-query)
export const STALE_TIME = 60 * 1000; // 1 minute

// Timeout for requests
export const REQUEST_TIMEOUT = 10000; // 10 seconds
