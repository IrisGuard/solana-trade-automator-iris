
import { errorCollector } from './error-handling/collector';
import { toast } from 'sonner';
import { ErrorOptions } from './error-handling/types';

/**
 * Display an error with consistent formatting
 */
export function displayError(error: Error | string, options: ErrorOptions = {}) {
  const {
    showToast = true,
    logToConsole = true,
    useCollector = true,
    title = 'Error',
    component = 'unknown',
    details = {},
    source = 'client'
  } = options;

  // Convert string to Error if needed
  const errorObj = error instanceof Error ? error : new Error(error);

  // Log to console if requested
  if (logToConsole) {
    console.error(`[${component}] ${errorObj.message}`, details);
  }

  // Show toast if requested
  if (showToast) {
    toast.error(title, {
      description: errorObj.message,
      duration: 5000
    });
  }

  // Add to error collector if requested
  if (useCollector) {
    errorCollector.captureError(errorObj, {
      component,
      details,
      source
    });
  }

  return errorObj;
}

// For backward compatibility
export { displayError as logError };
