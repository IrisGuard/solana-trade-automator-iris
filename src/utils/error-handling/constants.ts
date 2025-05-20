
/**
 * Constants used in error handling
 */

export const RPC_ENDPOINTS = {
  MAINNET: 'https://api.mainnet-beta.solana.com',
  DEVNET: 'https://api.devnet.solana.com',
  TESTNET: 'https://api.testnet.solana.com',
  HELIUS: 'https://api.helius.xyz/v0'
};

export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const ERROR_SOURCES = {
  CLIENT: 'client',
  SERVER: 'server',
  BLOCKCHAIN: 'blockchain',
  API: 'api',
  DATABASE: 'database'
};
