
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
  title?: string; // Adding missing property
  browserInfo?: Record<string, any>;
}

export interface TestErrorOptions {
  simulateDelay?: number;
  errorType?: string; // Adding missing property
}

export interface ErrorDisplayOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  sendToChat?: boolean;
  useCollector?: boolean;
  notifyUser?: boolean;
  title?: string; // Adding missing property
}

export interface ErrorCollector {
  addError: (errorData: ErrorData) => string;
  getErrors: () => ErrorData[];
  getAllErrors: () => ErrorData[]; // Add missing method
  clearErrors: () => void;
  clearAllErrors: () => void; // Add missing method
  captureError: (error: Error, options?: ErrorOptions) => string; // Add missing method
}
