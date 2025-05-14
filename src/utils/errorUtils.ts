
import { errorCollector } from './error-handling/collector';

// Error categories
export enum ErrorCategory {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  BLOCKCHAIN = 'BLOCKCHAIN',
  DATABASE = 'DATABASE',
  UNEXPECTED = 'UNEXPECTED'
}

// Error severities
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Structure for error reporting
export interface ErrorReport {
  message: string;
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: number;
  source: string;
  data?: any;
}

// Helper function to create a standardized error report
export function createErrorReport(
  message: string,
  code: string,
  category: ErrorCategory,
  severity: ErrorSeverity,
  source: string,
  data?: any
): ErrorReport {
  return {
    message,
    code,
    category,
    severity,
    timestamp: Date.now(),
    source,
    data
  };
}

// Helper to log errors consistently
export function logError(
  error: Error | ErrorReport | string,
  component?: string,
  additionalData?: any
): void {
  try {
    // Format the error based on its type
    let formattedError: Error;
    let errorData: Record<string, any> = {
      component,
      source: 'client',
      details: ''
    };
    
    if (error instanceof Error) {
      formattedError = error;
      if (additionalData) {
        errorData.details = JSON.stringify(additionalData);
      }
    } else if (typeof error === 'string') {
      formattedError = new Error(error);
      if (additionalData) {
        errorData.details = JSON.stringify(additionalData);
      }
    } else {
      // It's an ErrorReport
      formattedError = new Error(error.message);
      errorData = {
        ...errorData,
        details: JSON.stringify({
          code: error.code,
          category: error.category,
          severity: error.severity,
          data: error.data
        }),
        source: error.source || 'client'
      };
    }
    
    // Log to console
    console.error('Error logged:', formattedError, errorData);
    
    // Log to error collector for backend storage
    errorCollector.captureError(formattedError, errorData);
  } catch (err) {
    // Failsafe - if error logging itself fails, at least log to console
    console.error('Error in logError function:', err);
    console.error('Original error:', error);
  }
}
