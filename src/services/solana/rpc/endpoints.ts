
// RPC endpoints configuration for production use
export const SOLANA_RPC_ENDPOINTS = {
  // Primary RPC endpoints
  PRIMARY: 'https://api.mainnet-beta.solana.com',
  
  // Backup endpoints
  BACKUP: [
    'https://rpc.ankr.com/solana',
    'https://solana-api.projectserum.com',
    'https://solana.blockpi.network/v1/rpc/public'
  ]
};

/**
 * Get the best available RPC endpoint
 */
export function getBestRpcEndpoint(): string {
  return SOLANA_RPC_ENDPOINTS.PRIMARY;
}

/**
 * Get all available RPC endpoints in order of preference
 */
export function getAllRpcEndpoints(): string[] {
  const endpoints: string[] = [];
  endpoints.push(SOLANA_RPC_ENDPOINTS.PRIMARY);
  endpoints.push(...SOLANA_RPC_ENDPOINTS.BACKUP);
  return endpoints;
}
