
import { toast } from 'sonner';
import { errorCollector } from './collector';
import { sendErrorToChat } from './sendErrorToChat';
import type { ErrorDisplayOptions } from '../error-handling/types';

/**
 * Display an error message and optionally log it to the console, show a toast notification,
 * and/or send it to the chat.
 */
export function displayError(
  error: Error | string,
  options: ErrorDisplayOptions = {}
): string {
  const {
    title = 'Σφάλμα',
    component = 'unknown',
    logToConsole = true,
    showToast = true,
    sendToChat = false,
    useCollector = true,
    notifyUser = true,
    source = 'client',
    details
  } = options;

  // Create a standard error message
  const errorMessage = error instanceof Error ? error.message : error;

  // Log to console if requested
  if (logToConsole) {
    console.error('Error:', error);
    if (component) console.error('Component:', component);
    if (details) console.error('Details:', details);
  }

  // Add to error collector if requested
  let errorId = '';
  if (useCollector) {
    errorId = errorCollector.captureError(error, {
      component,
      source,
      details
    });
  }

  // Show toast if requested
  if (showToast && notifyUser) {
    toast.error(title, {
      description: errorMessage.substring(0, 100),
      duration: 5000,
    });
  }

  // Send to chat if requested
  if (sendToChat) {
    sendErrorToChat(error, {
      component,
      details,
      source
    });
  }

  // Always return the error ID (empty string if not collected)
  return errorId;
}
