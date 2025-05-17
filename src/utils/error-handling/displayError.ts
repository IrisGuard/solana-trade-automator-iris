
/**
 * Utility for displaying errors to users
 */
import { toast } from 'sonner';
import { errorCollector } from './collector';
import { sendErrorToChat } from './sendErrorToChat';

interface DisplayErrorOptions {
  showToast?: boolean;
  toastTitle?: string;
  component?: string;
  sendToChat?: boolean;
  useCollector?: boolean;
  details?: Record<string, unknown>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Display an error to the user and optionally collect it
 */
export function displayError(error: Error, options: DisplayErrorOptions = {}): void {
  // Default options
  const {
    showToast = true,
    toastTitle = 'Σφάλμα',
    component = 'Unknown',
    sendToChat = false,
    useCollector = true,
    details = {},
    severity = 'medium',
  } = options;

  // Always log to console
  console.error(`[displayError] ${component}:`, error);

  // Collect the error if requested
  if (useCollector) {
    errorCollector.captureError(error, {
      component,
      details,
      severity,
    });
  }

  // Show toast if requested
  if (showToast) {
    toast.error(toastTitle, {
      description: error.message || 'Παρουσιάστηκε ένα σφάλμα',
      duration: 5000,
    });
  }

  // Send to chat if requested
  if (sendToChat) {
    sendErrorToChat(error, { component, details });
  }
}
