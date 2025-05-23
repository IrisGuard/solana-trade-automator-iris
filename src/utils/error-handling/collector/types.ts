
export interface ErrorContext {
  component?: string;
  source?: string;
  details?: any;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface ErrorOptions {
  errorCode?: string;
  context?: any;
  metadata?: any;
  status?: string;
  errorId?: string;
  onError?: (error: Error) => void;
}

export interface CollectedError {
  id: string;
  message: string;
  stack?: string;
  component?: string;
  source?: string;
  timestamp: Date;
  severity?: string;
  resolved?: boolean;
  details?: any;
}

export interface ErrorData {
  id: string;
  message: string;
  stack?: string;
  source?: string;
  timestamp: Date;
  component?: string;
  data?: any;
}

export interface ErrorCollector {
  captureError(error: Error | string, context?: ErrorContext): void;
  getRecentErrors(): CollectedError[];
  getErrorCount(): number;
  clearErrors(): void;
}
