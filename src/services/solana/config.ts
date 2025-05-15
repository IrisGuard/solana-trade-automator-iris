
import { Connection, clusterApiUrl, Cluster } from '@solana/web3.js';
import { apiKeys, rpcEndpoints, defaultCluster } from './apiConfig';

// Constants for Solana ecosystem
export const LAMPORTS_PER_SOL = 1000000000;
export const KNOWN_PROGRAMS = {
  '11111111111111111111111111111111': 'System Program',
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': 'Token Program',
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL': 'Associated Token Program',
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s': 'Token Metadata Program',
  'p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98': 'Metaplex Auction Program',
  'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB': 'Jupiter',
  'So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo': 'Solend',
  'RVKd61ztZW9GUwhRbbLoYVRE5Xf1B2tVscKqwZqXgEr': 'Raydium',
  'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K': 'Mango Markets',
  'MERLuDFBMmsHnsBPZw2sDQZHvXFMwp8EdjudcU2HKky': 'Mercurial Finance',
};

// RPC endpoint configuration - make accessible from imported files
export const RPC_ENDPOINTS = {
  PRIMARY: rpcEndpoints.mainnet,
  BACKUP: 'https://rpc.ankr.com/solana',
  MAINNET: rpcEndpoints.mainnet,
  DEVNET: rpcEndpoints.devnet,
  TESTNET: rpcEndpoints.testnet,
  LOCAL: 'http://localhost:8899',
};

// API endpoints
export const API_ENDPOINTS = {
  HELIUS: 'https://api.helius.xyz/v1',
  BIRDEYE: 'https://api.birdeye.so',
  RAYDIUM: 'https://api.raydium.io',
  JUPITER: 'https://price.jup.ag/v4'
};

// API keys available to the application (Demo keys for testing)
export const API_KEYS = {
  HELIUS_DEMO: 'ddb32813-1f4b-459d-8964-310b1b73a053',
};

// Create a Solana connection
export const connection = new Connection(defaultCluster);

// Helper function to create a connection for a specific cluster
export const createConnection = (cluster: Cluster = 'mainnet-beta') => {
  return new Connection(clusterApiUrl(cluster));
};

// Helper function to create a connection using a custom RPC endpoint
export const createCustomConnection = (endpoint: string) => {
  return new Connection(endpoint);
};

// Helper to create a Helius connection with API key
export const createHeliusConnection = (apiKey: string) => {
  return new Connection(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`);
};
