
/**
 * Common types for error handling
 */
export type ErrorSource = 'SUPABASE' | 'SOLANA-RPC' | 'CONSOLE' | 'REACT';
export type ErrorLevel = 'CRITICAL' | 'WARNING' | 'INFO';

export interface BotError {
  timestamp: Date;
  message: string;
  source: ErrorSource;
  level: ErrorLevel;
  stackTrace?: string;
  metadata?: Record<string, unknown>;
  autoResolved?: boolean;
}

// Constants for RPC endpoints
export const RPC_ENDPOINTS = {
  PRIMARY: 'https://solana-mainnet.rpcpool.com',
  BACKUP: 'https://api.mainnet-beta.solana.com',
  FALLBACK: 'https://ssc-dao.genesysgo.net'
};
