
// Helius API configuration

// Base URLs for Helius API
export const HELIUS_BASE_URL = 'https://api.helius.xyz/v0';

// Fallback API key (public, rate-limited, only used when no keys available in Supabase)
// This is a DEMO key, it's ok to have it in the codebase for demo purposes
export const FALLBACK_HELIUS_KEY = '2d8dfd2d-95a2-4c38-9a55-e16759b8f8d9';

// Configuration settings for Helius requests
export const HELIUS_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000, // 30 seconds
};
