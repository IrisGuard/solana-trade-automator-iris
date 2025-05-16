
/**
 * Defines the severity levels for errors in the application
 */
export type ErrorSeverity = 'critical' | 'high' | 'medium' | 'low';

/**
 * Base interface for error objects in the system
 */
export interface SystemError {
  id: string;
  message: string;
  timestamp: string;
  level: 'CRITICAL' | 'WARNING' | 'INFO';
  source: string;
  stackTrace?: string;
  autoResolved?: boolean;
  resolved?: boolean;
}

/**
 * Enhanced Error interface supporting custom properties commonly used in our application
 */
export interface EnhancedError extends Error {
  // Common custom properties used in our error system
  status?: number;
  code?: string;
  errors?: Record<string, string[]>;
  details?: string;
  table?: string;
  constraint?: string;
  // Any additional properties can be added via index signature
  [key: string]: any;
}

/**
 * Bot error interface for handling errors in bot-related functionality
 */
export interface BotError extends Error {
  code?: string;
  metadata?: Record<string, any>;
  severity?: ErrorSeverity;
  timestamp?: string;
  source?: string;
  [key: string]: any;
}

/**
 * Creates an enhanced error with custom properties
 */
export function createEnhancedError(message: string, properties: Partial<EnhancedError> = {}): EnhancedError {
  const error = new Error(message) as EnhancedError;
  
  // Add all provided properties to the error object
  Object.assign(error, properties);
  
  return error;
}
