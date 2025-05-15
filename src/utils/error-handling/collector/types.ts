
export interface ErrorData {
  id: string;
  message: string;
  component?: string;
  source?: string;
  details?: any;
  timestamp: number;
  stack?: string;
  status?: number;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  errorType?: string;
  handled?: boolean;
  autoFixed?: boolean;
}

export interface ErrorOptions {
  component?: string;
  source?: string;
  details?: any;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  status?: number;
  errorType?: string;
  simulateDelay?: number;
  message?: string; // Added the missing message property
}

export interface ErrorCollector {
  captureError: (error: Error, options?: ErrorOptions) => string;
  getErrors: () => ErrorData[];
  getError: (id: string) => ErrorData | undefined;
  clearErrors: () => void;
  removeError: (id: string) => void;
  updateError: (id: string, updates: Partial<ErrorData>) => void;
  onErrorCaptured: (callback: (error: ErrorData) => void) => () => void;
}
