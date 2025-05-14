
/**
 * Types for error handling utilities
 */

export interface ErrorDisplayOptions {
  component?: string;
  details?: any;
  logToConsole?: boolean;
  showToast?: boolean;
  source?: string;
  sendToChat?: boolean;
  title?: string;
  useCollector?: boolean;
  notifyUser?: boolean;
}

export interface ErrorReportOptions {
  component?: string;
  details?: any;
  user?: any;
  source?: string;
}

export interface TestErrorOptions {
  message?: string;
  component?: string;
  details?: any;
  errorType?: string;
  simulateDelay?: number;
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface GroupedError {
  hash: string;
  count: number;
  lastOccurrence: Date;
  errorData: ErrorData;
}

export interface ErrorData {
  error: Error | string;
  component?: string;
  details?: any;
  timestamp?: Date;
}
