
import { toast } from 'sonner';
import { errorCollector } from './collector';

export interface DisplayErrorOptions {
  title?: string;
  description?: string;
  duration?: number;
  toastTitle?: string;
  showToast?: boolean;
  logToConsole?: boolean;
  sendToChat?: boolean;
  useCollector?: boolean;
  component?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  source?: string;
  details?: any;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function displayError(
  error: Error | string, 
  options: DisplayErrorOptions = {}
): void {
  const message = typeof error === 'string' ? error : error.message;
  const { 
    title = 'Error', 
    toastTitle = 'Error',
    description, 
    duration = 5000,
    showToast = true,
    logToConsole = true,
    useCollector = true,
    component,
    severity = 'medium',
    source = 'client'
  } = options;

  // Collect the error for monitoring
  if (useCollector) {
    errorCollector.captureError(error, {
      component: component || 'ErrorDisplay',
      source: source,
      severity, // Now we can pass the severity
      details: { title, description, duration }
    });
  }

  // Display the error toast
  if (showToast) {
    toast.error(toastTitle || title, {
      description: description || message,
      duration,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick
      } : undefined
    });
  }

  // Log to console for debugging
  if (logToConsole) {
    console.error('[DisplayError]', { title, message, error });
  }
}
