
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
  title?: string; // Added missing property
  useCollector?: boolean; // Added missing property
  notifyUser?: boolean; // Added missing property
}

export interface ErrorReportOptions {
  component?: string;
  details?: any;
  user?: any;
  source?: string; // Added missing property
}

export interface TestErrorOptions {
  message?: string;
  component?: string;
  details?: any;
  errorType?: string; // Added missing property
  simulateDelay?: number; // Added missing property
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
