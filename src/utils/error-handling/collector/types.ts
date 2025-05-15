
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
  handled?: boolean;
  autoFixed?: boolean;
}

export interface ErrorOptions {
  component?: string;
  source?: string;
  details?: Record<string, unknown>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  status?: number;
  errorType?: string;
  simulateDelay?: number;
  message?: string;
  toastDescription?: string;
}

export interface ErrorCollector {
  captureError(error: Error, options?: ErrorOptions): string;
  getErrors(): ErrorData[];
  clearErrors(): void;
  getError(id: string): ErrorData | undefined;
  removeError(id: string): void;
  updateError(id: string, updates: Partial<ErrorData>): void;
  onErrorCaptured(callback: (error: ErrorData) => void): () => void;
}
