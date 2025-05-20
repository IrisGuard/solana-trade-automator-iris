
// Common error message patterns
export const ERROR_PATTERNS = {
  RATE_LIMIT: ['429 Too Many Requests', 'Rate limit exceeded'],
  TIMEOUT: ['timeout', 'request timed out', 'connection refused'],
  INVALID_RESPONSE: ['invalid response', 'unexpected token']
};

// RPC endpoints
export const RPC_ENDPOINTS = {
  MAINNET: 'https://api.mainnet-beta.solana.com',
  DEVNET: 'https://api.devnet.solana.com',
  TESTNET: 'https://api.testnet.solana.com',
  HELIUS: 'https://rpc.helius.xyz',
  // Add backward compatibility for code using the old names
  PRIMARY: 'https://api.mainnet-beta.solana.com',
  BACKUP: 'https://api.devnet.solana.com',
  FALLBACK: 'https://api.testnet.solana.com'
};

// Navigation routes
export const APP_ROUTES = {
  HOME: '/',
  WALLET: '/wallet',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings'
};
