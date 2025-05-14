
import { errorCollector, type ErrorData } from './collector';
import { toast } from 'sonner';

// Error display options
interface ErrorDisplayOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  source?: string;
  component?: string;
  details?: any;
}

/**
 * Default options for error display
 */
const defaultOptions: ErrorDisplayOptions = {
  showToast: true,
  logToConsole: true,
  source: 'client'
};

/**
 * Display an error with various output options
 * @param error The error to display
 * @param options Display options
 */
export function displayError(error: Error | string, options: ErrorDisplayOptions = {}) {
  const opts = { ...defaultOptions, ...options };
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;
  
  // Create error data for collector
  const errorData: ErrorData = {
    message: errorMessage,
    stack: errorStack,
    source: opts.source || 'client',
    timestamp: Date.now(),
    component: opts.component,
    details: opts.details
  };

  // Log to console if enabled
  if (opts.logToConsole) {
    console.error('[Error]', errorMessage);
    if (errorStack) {
      console.error(errorStack);
    }
    if (opts.details) {
      console.error('Details:', opts.details);
    }
  }

  // Add to error collector
  errorCollector.captureError(error, {
    component: opts.component,
    source: opts.source,
    details: opts.details
  });

  // Show toast if enabled
  if (opts.showToast) {
    toast.error(errorMessage);
  }

  return errorData;
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: Error | string): string {
  if (typeof error === 'string') {
    return error;
  }
  
  return error.message || 'An unknown error occurred';
}
