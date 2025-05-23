
export interface ErrorData {
  message: string;
  stack?: string;
  timestamp: Date;
  component?: string;
  source?: string;
  error?: Error;
  data?: any;
}

export interface ErrorOptions {
  component?: string;
  source?: string;
  details?: any;
  errorType?: string;
  method?: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface ErrorContext {
  component?: string;
  source?: string;
  details?: any;
  method?: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface ErrorCollector {
  captureError(error: any, context?: ErrorContext): void;
  captureException(error: Error, context?: ErrorContext): void;
  getErrors(): ErrorData[];
  getRecentErrors(limit?: number): ErrorData[];
  clearErrors(): void;
}
