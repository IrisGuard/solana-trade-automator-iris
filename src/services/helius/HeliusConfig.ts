
// Helius API configuration

// Base URLs for Helius API
export const HELIUS_BASE_URL = 'https://api.helius.xyz/v0';

// Updated Fallback API key to use the new key
export const FALLBACK_HELIUS_KEY = 'ddb32813-1f4b-459d-8964-310b1b73a053';

// Configuration settings for Helius requests
export const HELIUS_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000, // 30 seconds
};
