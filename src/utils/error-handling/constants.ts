
/**
 * Constants used in error handling throughout the application
 */

// Solana RPC endpoints for fallback scenarios
export const RPC_ENDPOINTS = {
  PRIMARY: 'https://api.mainnet-beta.solana.com',
  BACKUP: 'https://solana-api.projectserum.com',
  FALLBACK: 'https://rpc.ankr.com/solana'
};

// Error reporting endpoints
export const ERROR_REPORTING = {
  ENDPOINT: '/api/errors/report',
  TIMEOUT: 10000 // 10 seconds
};

// Severity levels mapping
export const SEVERITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};
