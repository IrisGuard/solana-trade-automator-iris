
/**
 * Defines the type of error source for clearer error categorization
 */
export type ErrorSource = 
  | 'api'
  | 'database'
  | 'network'
  | 'wallet'
  | 'transaction'
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'parsing'
  | 'user-input'
  | 'external-service'
  | 'helius-api'
  | 'sendRpcRequest'
  | 'getEnhancedTransaction'
  | 'getEnhancedTransactions'
  | 'getEnhancedTransactionHistory'
  | 'getAddressAssets'
  | 'parseTransactionData'
  | 'getNftEvents'
  | 'verifyConnection'
  | string;  // Allow string for extensibility

/**
 * Error severity levels
 */
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Data structure for collected errors
 */
export interface ErrorData {
  message: string;
  source: ErrorSource;
  severity: ErrorSeverity;
  timestamp?: Date;
  raw?: any; // Original error object or related data
  userId?: string;
  sessionId?: string;
  context?: Record<string, any>;
}

/**
 * Options for error collection
 */
export interface ErrorOptions {
  shouldLog?: boolean;
  shouldToast?: boolean;
  shouldReportToAnalytics?: boolean;
}

/**
 * Interface for error collector functionality
 */
export interface ErrorCollector {
  collectError: (data: ErrorData, options?: ErrorOptions) => void;
  getRecentErrors: () => ErrorData[];
  clearErrors: () => void;
  hasCriticalErrors: () => boolean;
}
