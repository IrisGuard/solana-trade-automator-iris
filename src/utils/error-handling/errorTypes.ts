
/**
 * Error source types - categorizing where errors originate from
 */
export type ErrorSource = 
  | 'SUPABASE' 
  | 'SOLANA-RPC' 
  | 'CONSOLE' 
  | 'REACT' 
  | 'UI' 
  | 'API' 
  | 'WALLET'
  | 'TRADING-BOT'
  | 'NETWORK';

/**
 * Error severity levels
 */
export type ErrorLevel = 'INFO' | 'WARNING' | 'CRITICAL';

/**
 * Default RPC endpoints for Solana
 */
export const RPC_ENDPOINTS = {
  PRIMARY: 'https://api.mainnet-beta.solana.com',
  BACKUP: 'https://solana-mainnet.g.alchemy.com/v2/demo',
  FALLBACK: 'https://rpc.ankr.com/solana',
  TESTNET: 'https://api.testnet.solana.com'
};

/**
 * Bot error interface for standardized error format
 */
export interface BotError {
  message: string;
  source: ErrorSource;
  level: ErrorLevel;
  timestamp: Date;
  stackTrace?: string;
  metadata?: Record<string, any>;
  autoResolved?: boolean;
  synced?: boolean;
}

/**
 * Create a standard BotError object
 */
export function createBotError(
  message: string, 
  source: ErrorSource, 
  level: ErrorLevel = 'WARNING',
  metadata?: Record<string, any>
): BotError {
  return {
    message,
    source,
    level,
    timestamp: new Date(),
    metadata
  };
}
