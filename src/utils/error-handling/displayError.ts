
import { toast } from 'sonner';
import { errorCollector } from './collector';

export interface DisplayErrorOptions {
  title?: string;
  description?: string;
  duration?: number;
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
  const { title = 'Error', description, duration = 5000 } = options;

  // Collect the error for monitoring
  errorCollector.captureError(error, {
    component: 'ErrorDisplay',
    source: 'displayError',
    details: { title, description, duration }
  });

  // Display the error toast
  toast.error(title, {
    description: description || message,
    duration,
    action: options.action ? {
      label: options.action.label,
      onClick: options.action.onClick
    } : undefined
  });

  // Log to console for debugging
  console.error('[DisplayError]', { title, message, error });
}
