
/** Error options for capturing errors */
export interface ErrorOptions {
  component?: string;
  source?: string;
  errorCode?: string;
  context?: string;
  metadata?: any;
  status?: number;
  errorId?: string;
  errorType?: string;
  details?: Record<string, unknown>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  onError?: (error: ErrorData) => void;
}

/** Error data structure */
export interface ErrorData {
  id: string;
  error: Error;
  message: string;
  stack: string | null;
  timestamp: string;
  component: string | null;
  source: string;
  url: string;
  browserInfo: {
    userAgent: string;
    language: string;
    platform: string;
    screenSize?: string;
    timestamp?: string;
  };
  errorCode: string | null;
  context: string | null;
  metadata: any | null;
  status: number | null;
  errorId: string | null;
  errorType?: string;
  details?: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  options: ErrorOptions;
}

/** Error Collector Interface */
export interface ErrorCollector {
  captureError: (error: Error | string, options?: ErrorOptions) => string;
  getErrors: () => ErrorData[];
  clearErrors: () => void;
  getErrorCount: () => number;
}
