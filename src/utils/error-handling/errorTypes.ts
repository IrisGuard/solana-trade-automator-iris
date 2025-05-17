
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

// Import RPC_ENDPOINTS from constants instead of defining here
import { RPC_ENDPOINTS } from './constants';
export { RPC_ENDPOINTS };
