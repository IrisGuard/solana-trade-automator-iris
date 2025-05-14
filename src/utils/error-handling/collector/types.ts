
export interface ErrorData {
  id?: string;
  message: string;
  stack?: string;
  component?: string;
  source?: string;
  timestamp: string;
  url?: string;
  browserInfo?: Record<string, any>;
  resolved?: boolean;
  errorType?: string;
  code?: string;
}

export interface ErrorOptions {
  component?: string;
  source?: string;
  url?: string;
  errorType?: string;
  title?: string;
  browserInfo?: Record<string, any>;
  details?: any; // Added missing property
}

export interface TestErrorOptions {
  simulateDelay?: number;
  errorType?: string;
  message?: string; // Added missing property
  component?: string; // Added missing property
  details?: any; // Added missing property
}

export interface ErrorDisplayOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  sendToChat?: boolean;
  useCollector?: boolean;
  notifyUser?: boolean;
  title?: string;
}

export interface ErrorCollector {
  addError: (errorData: ErrorData) => string;
  getErrors: () => ErrorData[];
  getAllErrors: () => ErrorData[];
  clearErrors: () => void;
  clearAllErrors: () => void;
  captureError: (error: Error, options?: ErrorOptions) => string;
}
