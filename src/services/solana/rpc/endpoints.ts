
// RPC endpoints configuration with fallback mechanisms
export const SOLANA_RPC_ENDPOINTS = {
  // Primary RPC endpoints (free tier compatible)
  PRIMARY: 'https://api.mainnet-beta.solana.com',
  
  // Backup endpoints
  BACKUP: [
    'https://rpc.ankr.com/solana',
    'https://solana-api.projectserum.com',
    'https://api.mainnet-beta.solana.com'
  ],
  
  // Helius endpoints (if API keys available)
  HELIUS_BASE: 'https://rpc.helius.xyz',
  
  // Rate limit friendly endpoints
  RATE_LIMITED: [
    'https://solana-mainnet.rpc.extrnode.com',
    'https://solana.blockpi.network/v1/rpc/public'
  ]
};

// Demo Helius API keys for development
export const HELIUS_DEMO_KEYS = [
  'ddb32813-1f4b-459d-8964-310b1b73a053',
  'demo-key-fallback'
];

/**
 * Get the best available RPC endpoint
 */
export function getBestRpcEndpoint(): string {
  // Try to use Helius with demo key first
  const heliusKey = HELIUS_DEMO_KEYS[0];
  if (heliusKey && heliusKey !== 'demo-key-fallback') {
    return `${SOLANA_RPC_ENDPOINTS.HELIUS_BASE}/?api-key=${heliusKey}`;
  }
  
  // Fall back to primary endpoint
  return SOLANA_RPC_ENDPOINTS.PRIMARY;
}

/**
 * Get all available RPC endpoints in order of preference
 */
export function getAllRpcEndpoints(): string[] {
  const endpoints: string[] = [];
  
  // Add Helius endpoints with demo keys
  HELIUS_DEMO_KEYS.forEach(key => {
    if (key && key !== 'demo-key-fallback') {
      endpoints.push(`${SOLANA_RPC_ENDPOINTS.HELIUS_BASE}/?api-key=${key}`);
    }
  });
  
  // Add backup endpoints
  endpoints.push(SOLANA_RPC_ENDPOINTS.PRIMARY);
  endpoints.push(...SOLANA_RPC_ENDPOINTS.BACKUP);
  endpoints.push(...SOLANA_RPC_ENDPOINTS.RATE_LIMITED);
  
  return endpoints;
}
