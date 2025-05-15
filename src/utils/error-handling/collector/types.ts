
export interface ErrorData {
  id: string;
  message: string;
  stack?: string;
  component?: string;
  source?: string;
  details?: any;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
}

export interface ErrorOptions {
  component?: string;
  source?: string;
  details?: any;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  message?: string;
  simulateDelay?: number;
  type?: string;
  errorType?: string;
}

export interface ErrorCollector {
  captureError(error: Error | string, options?: ErrorOptions): string;
  getErrors(): ErrorData[];
  clearErrors(): void;
}
