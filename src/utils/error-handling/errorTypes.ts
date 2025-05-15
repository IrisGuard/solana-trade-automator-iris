
// Define common error types to be used throughout the application

export interface BotError extends Error {
  code?: string;
  status?: number;
  source?: string;
  component?: string;
  metadata?: {
    rpcEndpoint?: string;
    timestamp?: number;
    tokenAddress?: string;
    walletAddress?: string;
    [key: string]: any;
  };
}

export enum ErrorSource {
  CLIENT = 'client',
  SERVER = 'server',
  BLOCKCHAIN = 'blockchain',
  API = 'api'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export const RPC_ENDPOINTS = {
  PRIMARY: 'https://rpc.ankr.com/solana',
  BACKUP: 'https://api.mainnet-beta.solana.com',
  FALLBACK: 'https://solana-api.projectserum.com'
};
