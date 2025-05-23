
import { toast } from 'sonner';
import { errorCollector } from './collector';

interface ErrorContext {
  component?: string;
  source?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  details?: any;
}

interface DisplayErrorOptions {
  title?: string;
  description?: string;
  showToast?: boolean;
  logToConsole?: boolean;
  useCollector?: boolean;
  component?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  sendToChat?: boolean;
}

export function displayError(error: Error | string, options: DisplayErrorOptions = {}) {
  const {
    title = "Error",
    description,
    showToast = true,
    logToConsole = true,
    useCollector = true,
    component = "Unknown",
    severity = "medium"
  } = options;

  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;

  // Log to console if requested
  if (logToConsole) {
    console.error(`[${component}] ${errorMessage}`, error);
  }

  // Add to error collector if requested
  if (useCollector) {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    errorCollector.captureError(errorObj, {
      component,
      source: 'displayError',
      severity,
      details: options
    });
  }

  // Show toast notification if requested
  if (showToast) {
    const toastDescription = description || errorMessage;
    
    if (severity === 'critical' || severity === 'high') {
      toast.error(title, {
        description: toastDescription,
        duration: 8000
      });
    } else {
      toast.error(title, {
        description: toastDescription,
        duration: 5000
      });
    }
  }
}
