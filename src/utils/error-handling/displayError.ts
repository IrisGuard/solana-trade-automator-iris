
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
  title?: string;
  logToConsole?: boolean;
  sendToChat?: boolean;
  useCollector?: boolean;
  notifyUser?: boolean;
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

  // Log to console if requested
  if (options.logToConsole) {
    console.error('[ERROR]', message, errorObj);
  }

  // Collect the error if requested
  let errorId = '';
  if (options.useCollector !== false) {
    errorId = errorCollector.captureError(errorObj, {
      component: options.component || 'unknown',
      source: options.source || 'client',
      method: options.errorType,
      severity: options.severity || 'medium',
      details: options.details
    });
  }
  
  // Display toast if requested
  if (options.showToast) {
    toast.error(options.toastTitle || options.title || 'Error', {
      description: message,
      id: errorId
    });
  }
  
  // Send to chat implementation would go here
  if (options.sendToChat) {
    try {
      // This would typically connect to a chat service or error reporting system
      console.log('[CHAT] Error sent:', message);
    } catch (e) {
      console.error('Failed to send error to chat:', e);
    }
  }
  
  return errorId;
};
