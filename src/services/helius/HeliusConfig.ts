
// Configuration for Helius API
// No hardcoded API keys - these are managed through the database

// Base URL for Helius API
export const HELIUS_API_BASE_URL = 'https://api.helius.xyz/v0';

// Fallback key - this is only used if no key is found in the database
// Should be null in production to avoid unexpected API usage
export const FALLBACK_HELIUS_KEY = null;

// Default RPC endpoint
export const DEFAULT_HELIUS_RPC = 'https://mainnet.helius-rpc.com';

// API endpoints
export const HELIUS_ENDPOINTS = {
  balances: '/addresses/{address}/balances',
  transactions: '/addresses/{address}/transactions',
  nftEvents: '/nft-events',
  tokenMetadata: '/tokens/metadata',
  enhancedTransactions: '/transactions'
};

// Configuration options
export const HELIUS_CONFIG = {
  cacheDuration: 60 * 1000, // 1 minute cache
  retryCount: 3,
  retryDelay: 1000,
  timeout: 30000 // 30 seconds
};
