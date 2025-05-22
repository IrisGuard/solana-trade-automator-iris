
// Define constants for error handling

export const RPC_ENDPOINTS = {
  PRIMARY: 'https://rpc.ankr.com/solana',
  BACKUP: 'https://api.mainnet-beta.solana.com',
  FALLBACK: 'https://solana-api.projectserum.com'
};

export const ERROR_TYPES = {
  NETWORK: 'network',
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  INTERNAL: 'internal',
  UNKNOWN: 'unknown'
};

export const ERROR_SEVERITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};
