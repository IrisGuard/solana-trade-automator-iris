
// Error data structure
export interface ErrorData {
  id: string;
  timestamp: Date;
  error: Error;
  message: string;
  stack?: string;
  source?: string;
  component?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  type?: string; // Allow any string value for broad error type support
  handled?: boolean;
  details?: any;
  retryCount?: number;
  userId?: string;
}

// Error collection options
export interface ErrorOptions {
  source?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  type?: string; // Allow any string value for error type
  message?: string;
  component?: string;
  details?: any;
  errorType?: string; // Using string type to allow more flexible error types
  simulateDelay?: number;
}

// Error collector interface
export interface ErrorCollector {
  captureError(error: Error | string, options?: ErrorOptions): void;
  getErrors(type?: string): ErrorData[];
  getAllErrors(type?: string): ErrorData[]; // Alias for getErrors
  clearErrors(type?: string): void;
  clearAllErrors(type?: string): void; // Alias for clearErrors
  setErrorCallback(callback: (error: ErrorData) => void): void;
}
