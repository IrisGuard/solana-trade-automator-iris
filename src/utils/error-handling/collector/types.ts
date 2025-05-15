
export interface ErrorData {
  message: string;
  stack?: string;
  component?: string;
  source?: string;
  details?: any;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface ErrorOptions {
  component?: string;
  source?: string;
  details?: any;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface ErrorCollector {
  captureError(error: Error, options?: ErrorOptions): void;
}
