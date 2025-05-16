
import { ErrorSeverity } from '../errorTypes';

/**
 * Interface for error data stored in the collector
 */
export interface ErrorData {
  id: string;
  error: Error;
  message: string | null;
  stack: string | null;
  timestamp: string;
  component: string | null;
  source: string;
  url: string;
  browserInfo: any;
  errorCode: string | null;
  context: any;
  metadata: any;
  status: number | null;
  errorId: string | null;
  errorType?: string;
  details?: any;
  severity: ErrorSeverity;
  options?: any;
  resolved?: boolean;
}

/**
 * Options for error collection
 */
export interface ErrorOptions {
  component?: string;
  source?: string;
  errorCode?: string;
  context?: any;
  metadata?: any;
  status?: number;
  errorId?: string;
  errorType?: string;
  method?: string;
  onError?: (error: ErrorData) => void;
  details?: Record<string, unknown>;
  severity?: ErrorSeverity;
  data?: Record<string, any>;
}

/**
 * Interface for the ErrorCollector class
 */
export interface ErrorCollector {
  captureError(error: Error | string, options?: ErrorOptions): string;
  getErrors(): ErrorData[];
  getRecentErrors(limit?: number): ErrorData[];
  clearErrors(): void;
  getErrorCount(): number;
}
