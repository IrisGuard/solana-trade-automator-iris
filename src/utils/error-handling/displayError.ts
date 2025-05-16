
import { toast } from 'sonner';
import { errorCollector } from './collector';
import type { ErrorData } from './collector';

interface DisplayErrorOptions {
  showToast?: boolean;
  toastTitle?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  component?: string;
  source?: string;
  details?: any;
  errorType?: string;
}

/**
 * Utility to display errors to the user and log them to the collector
 */
export const displayError = (
  error: Error | string,
  options: DisplayErrorOptions = {}
): string => {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  const message = errorObj.message || 'An unknown error occurred';

  // Collect the error
  const errorId = errorCollector.captureError(errorObj, {
    component: options.component || 'unknown',
    source: options.source || 'client',
    method: options.errorType,
    severity: options.severity || 'medium',
    details: options.details
  });
  
  // Display toast if requested
  if (options.showToast) {
    toast.error(options.toastTitle || 'Error', {
      description: message,
      id: errorId
    });
  }
  
  return errorId;
};
