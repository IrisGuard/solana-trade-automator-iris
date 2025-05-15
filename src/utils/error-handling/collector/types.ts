
export interface ErrorData {
  id?: string;
  name?: string;
  message?: string;
  stack?: string;
  cause?: unknown;
  code?: string | number;
  fileName?: string;
  lineNumber?: number;
  columnNumber?: number;
  component?: string;
  source?: string;
  details?: Record<string, unknown>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  status?: number;
  errorType?: string;
  timestamp?: number;
  browser?: {
    name?: string;
    version?: string;
    os?: string;
  };
}

export interface ErrorOptions {
  component?: string;
  source?: string;
  details?: Record<string, unknown>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  status?: number;
  errorType?: string;
  simulateDelay?: number;
  message?: string; // Added the missing message property
  toastDescription?: string; // Added for toast displays
}

export interface ErrorCollector {
  captureError(error: Error, options?: ErrorOptions): void;
  getErrors(): ErrorData[];
  clearErrors(): void;
}
