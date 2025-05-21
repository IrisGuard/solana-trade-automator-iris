
export interface ErrorData {
  id?: string;
  error: Error;
  component?: string | null;
  details?: any;
  timestamp?: string;
  source?: string | null;
  stack?: string | null;
  url?: string | null;
  browserInfo?: any;
  message?: string;
  errorCode?: string | null;
  context?: any | null;
  metadata?: any | null;
  status?: number | null;
  errorId?: string | null;
  errorType?: string | null;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  options?: any;
}

export interface ErrorOptions {
  component?: string;
  source?: string;
  url?: string;
  details?: Record<string, unknown>;
  browserInfo?: any;
  useCollector?: boolean;
  toastTitle?: string;
  title?: string;
  errorCode?: string;
  status?: number;
  context?: any;
  metadata?: any;
  errorId?: string;
  errorType?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  onError?: (errorData: ErrorData) => void;
}

export interface GroupedError {
  hash: string;
  count: number;
  lastOccurrence: Date;
  errorData: ErrorData;
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ErrorCollector = {
  captureError: (error: Error | string, options?: ErrorOptions) => string;
  getErrors: () => ErrorData[];
  clearErrors: () => void;
  getErrorCount: () => number;
};
