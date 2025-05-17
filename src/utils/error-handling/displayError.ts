
import { toast } from 'sonner';
import { errorCollector } from './collector';

interface DisplayErrorOptions {
  showToast?: boolean;
  toastTitle?: string;
  toastDescription?: string;
  component?: string;
  source?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  details?: Record<string, unknown>;
}

/**
 * Display an error to the user and log it to the error collector
 */
export function displayError(error: Error | string, options: DisplayErrorOptions = {}) {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  const errorMessage = errorObj.message || 'An unknown error occurred';
  
  // Collect error with the error collector
  const errorId = errorCollector.captureError(errorObj, {
    component: options.component || 'unknown',
    source: options.source || 'client',
    severity: options.severity || 'medium',
    details: options.details
  });
  
  // Prevent showing too many toasts for similar errors
  if (options.showToast !== false) {
    // Rate limit similar errors
    const now = Date.now();
    const lastErrorTime = window._lastErrorDisplayTimes?.[errorMessage] || 0;
    
    if (!window._lastErrorDisplayTimes) {
      window._lastErrorDisplayTimes = {};
    }
    
    // Only show toast if same error hasn't been shown in the last 5 seconds
    if (now - lastErrorTime > 5000) {
      window._lastErrorDisplayTimes[errorMessage] = now;
      
      toast.error(options.toastTitle || 'Error', {
        id: `error-${errorId}`,
        description: options.toastDescription || errorMessage
      });
    }
  }
  
  return errorId;
}
