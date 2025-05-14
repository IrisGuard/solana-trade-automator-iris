
// Type definitions for error collector

export type ErrorSource = 'client' | 'server' | 'network' | 'test';

export interface ErrorOptions {
  component?: string;
  source?: ErrorSource;
  url?: string;
  title?: string;
  details?: Record<string, any>;
  browserInfo?: Record<string, any>;
}

export interface TestErrorOptions extends ErrorOptions {
  errorType?: string;
}

export interface ErrorData {
  id?: string;
  message: string;
  stack?: string;
  component?: string;
  source: ErrorSource;
  url?: string;
  browserInfo?: Record<string, any>;
  timestamp: Date;
}

export interface ErrorDisplayOptions {
  title?: string;
  showStack?: boolean;
  showReportButton?: boolean;
}

export interface ErrorCollector {
  captureError: (error: Error | unknown, options?: ErrorOptions) => string;
  getErrors: () => ErrorData[];
  clearErrors: () => void;
  logError: (errorData: ErrorData) => Promise<string | null>;
}
