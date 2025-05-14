// API Keys configuration file

// Central place to store and access API keys
export const apiKeys = {
  // Helius API keys
  helius: process.env.HELIUS_API_KEYS ? process.env.HELIUS_API_KEYS.split(',') : [],
  
  // Jupiter API keys
  jupiter: process.env.JUPITER_API_KEYS ? process.env.JUPITER_API_KEYS.split(',') : [],
  
  // Solana API keys
  solana: process.env.SOLANA_API_KEYS ? process.env.SOLANA_API_KEYS.split(',') : [],
  
  // Other services can be added as needed
  birdeye: process.env.BIRDEYE_API_KEYS ? process.env.BIRDEYE_API_KEYS.split(',') : [],
  
  // Demo keys for testing
  demo: ['demo-key-1', 'demo-key-2', 'demo-key-3']
};

// RPC endpoint configuration
export const rpcEndpoints = {
  mainnet: process.env.SOLANA_MAINNET_RPC || 'https://api.mainnet-beta.solana.com',
  devnet: process.env.SOLANA_DEVNET_RPC || 'https://api.devnet.solana.com',
  testnet: process.env.SOLANA_TESTNET_RPC || 'https://api.testnet.solana.com'
};

// Default configuration
export const defaultNetwork = 'mainnet';
export const defaultCluster = rpcEndpoints[defaultNetwork as keyof typeof rpcEndpoints];

// Export for use in other modules
export default {
  apiKeys,
  rpcEndpoints,
  defaultNetwork,
  defaultCluster
};
