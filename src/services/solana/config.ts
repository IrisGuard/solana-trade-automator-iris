
import { Connection, clusterApiUrl, Cluster } from '@solana/web3.js';
import { apiKeys, rpcEndpoints, defaultCluster } from './apiConfig';

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
