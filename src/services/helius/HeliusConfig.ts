
// Default configuration values for Helius service

// Fallback API key used when no keys are available from the database
// Replace with your own key in production
export const FALLBACK_HELIUS_KEY = 'ddb32813-1f4b-459d-8964-310b1b73a053';

// Base URL for Helius API
export const HELIUS_BASE_URL = 'https://api.helius.xyz/v0';

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 10000;

// Rate limit settings
export const RATE_LIMIT = {
  maxRequestsPerMinute: 60,
  maxRequestsPerHour: 1000,
  maxRequestsPerDay: 10000
};

// Retry settings
export const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 500,
  maxDelayMs: 5000
};
