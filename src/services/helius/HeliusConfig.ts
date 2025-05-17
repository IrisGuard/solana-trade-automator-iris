
// Fallback API key for development
export const FALLBACK_HELIUS_KEY = "ddb32813-1f4b-459d-8964-310b1b73a053";

// API Base URL
export const HELIUS_API_BASE_URL = "https://api.helius.xyz/v0";
// Alias for backward compatibility
export const HELIUS_BASE_URL = HELIUS_API_BASE_URL;

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

// Configuration object for Helius (for easier imports)
export const HELIUS_CONFIG = {
  baseUrl: HELIUS_API_BASE_URL,
  rateLimits: HELIUS_RATE_LIMITS,
  defaultNetwork: DEFAULT_NETWORK,
  staleTime: STALE_TIME,
  timeout: REQUEST_TIMEOUT
};
