
export interface ErrorContext {
  component?: string;
  source?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  details?: any;
}

export interface ErrorData {
  id?: string; // Made optional as it's generated internally
  message: string;
  stack?: string;
  timestamp: Date;
  component?: string;
  source?: string;
  severity?: string;
  details?: any;
  data?: any;
}

export interface CollectedError {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  component?: string;
  source?: string;
  severity?: string;
  details?: any;
  resolved: boolean;
}

export interface ErrorCollector {
  captureError(error: Error | string, context?: ErrorContext): void;
  getRecentErrors(): CollectedError[];
  getErrors(): CollectedError[];
  getErrorCount(): number;
  clearErrors(): void;
}
