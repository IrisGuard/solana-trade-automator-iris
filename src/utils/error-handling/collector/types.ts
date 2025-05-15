
export interface ErrorOptions {
  component?: string;
  source?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  errorType?: string;
  message?: string;
  details?: any;
}

export interface ErrorData {
  id: string;
  error: Error;
  timestamp: number;
  options: ErrorOptions;
}

export interface ErrorCollector {
  captureError(error: Error, options?: ErrorOptions): string;
  getErrors(): ErrorData[];
  clearErrors(): void;
}
