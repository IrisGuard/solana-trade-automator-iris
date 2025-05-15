
import { toast } from 'sonner';
import { errorCollector } from './collector';

export interface DisplayErrorOptions {
  component?: string;
  source?: string;
  details?: any;
  showToast?: boolean;
  toastTitle?: string;
  toastDescription?: string;
  logToConsole?: boolean;
  sendToChat?: boolean;
  useCollector?: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  title?: string; // Added title property
}

export function displayError(error: Error, options: DisplayErrorOptions = {}) {
  // Log to console if requested
  if (options.logToConsole !== false) {
    console.error('[Error]', error);
    if (options.details) {
      console.error('[Error Details]', options.details);
    }
  }
  
  // Use error collector if requested
  if (options.useCollector !== false) {
    errorCollector.captureError(error, {
      component: options.component,
      source: options.source,
      details: options.details,
      severity: options.severity,
      // We no longer pass message since we've removed it from the type
    });
  }
  
  // Show toast if requested
  if (options.showToast) {
    toast.error(options.toastTitle || options.title || 'Error', {
      description: options.toastDescription || error.message,
      duration: 5000
    });
  }
  
  return error;
}
