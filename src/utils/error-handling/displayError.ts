
/**
 * Utility for displaying errors to users
 */
import { toast } from 'sonner';
import { errorCollector } from './collector';
import { sendErrorToChat } from './sendErrorToChat';
import { sanitizeErrorObject } from '@/utils/errorTestUtils';

interface DisplayErrorOptions {
  showToast?: boolean;
  toastTitle?: string;
  component?: string;
  sendToChat?: boolean;
  useCollector?: boolean;
  details?: Record<string, unknown>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  source?: string;
}

/**
 * Display an error to the user and optionally collect it
 */
export function displayError(error: Error | unknown, options: DisplayErrorOptions = {}): void {
  // Ensure we have a proper Error object that is sanitized for React
  const errorObj = error instanceof Error ? error : new Error(String(error));
  const sanitizedError = sanitizeErrorObject(errorObj);

  // Default options
  const {
    showToast = true,
    toastTitle = 'Σφάλμα',
    component = 'Unknown',
    sendToChat = false,
    useCollector = true,
    details = {},
    severity = 'medium',
    source = 'unknown',
  } = options;

  // Always log to console
  console.error(`[displayError] ${component}:`, sanitizedError);

  // Collect the error if requested
  if (useCollector) {
    errorCollector.captureError(sanitizedError, {
      component,
      details,
      severity,
      source,
    });
  }

  // Show toast if requested
  if (showToast) {
    toast.error(toastTitle, {
      description: typeof sanitizedError.message === 'string' ? 
        sanitizedError.message : 
        'Παρουσιάστηκε ένα σφάλμα',
      duration: 5000,
    });
  }

  // Send to chat if requested
  if (sendToChat) {
    sendErrorToChat(sanitizedError, { component, details });
  }
}
