
/**
 * Interface for standard error data
 */
export interface ErrorData {
  id: string;
  message: string;
  stack: string | null;
  timestamp: string;
  component: string | null;
  source: string;
  url: string;
  browserInfo: any;
  errorCode?: string | null;
  context?: any | null;
  metadata?: any | null;
  status?: number | null;
  errorId?: string | null;
  errorType?: string;
  details?: any;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Options for capturing errors
 */
export interface ErrorOptions {
  component?: string;
  source?: string;
  onError?: (errorData: ErrorData) => void;
  errorCode?: string;
  context?: any;
  metadata?: any;
  status?: number;
  errorId?: string;
  details?: any;
  errorType?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Interface for ErrorCollector class
 */
export interface ErrorCollector {
  captureError(error: Error | string, options?: ErrorOptions): string;
  getErrors(): ErrorData[];
  clearErrors(): void;
  getErrorCount(): number;
}
