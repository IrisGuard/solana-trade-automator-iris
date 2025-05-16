
export interface ErrorOptions {
  component?: string;
  source?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  errorType?: string;
  message?: string;
  details?: any;
  errorCode?: string;
  context?: any;
  metadata?: any;
  status?: string;
  errorId?: string;
  onError?: (errorData: ErrorData) => void;
}

export interface ErrorData {
  id: string;
  error: Error;
  timestamp: string;
  message: string;
  stack?: string | null;
  component?: string | null;
  source?: string;
  url?: string;
  browserInfo?: any;
  errorCode?: string | null;
  context?: any | null;
  metadata?: any | null;
  status?: string | null;
  errorId?: string | null;
  errorType?: string;
  details?: any;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  options: ErrorOptions;
}

export interface ErrorCollector {
  captureError(error: Error | string, options?: ErrorOptions): string;
  getErrors(): ErrorData[];
  clearErrors(): void;
  getErrorCount(): number;
}
