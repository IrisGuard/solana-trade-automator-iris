
export interface ErrorData {
  id?: string;
  message: string;
  component?: string;
  details?: any;
  timestamp: Date;
  source?: string;
  stack?: string;
  url?: string;
  browserInfo?: any;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface ErrorOptions {
  component?: string;
  source?: string;
  url?: string;
  details?: any;
  browserInfo?: any;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface TestErrorOptions {
  message?: string;
  component?: string;
  details?: any;
  errorType?: 'js' | 'async' | 'ui' | 'network';
  simulateDelay?: number;
}

export interface ErrorCollector {
  captureError(error: Error | string, options?: ErrorOptions): string;
  getErrors(): ErrorData[];
  clearErrors(): void;
  hasCriticalErrors(): boolean;
  getRecentErrors(count?: number): ErrorData[];
}
