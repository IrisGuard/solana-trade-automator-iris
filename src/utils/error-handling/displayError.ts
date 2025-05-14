
import { toast } from "sonner";
import { errorCollector } from "./collector";
import { ErrorDisplayOptions } from "./types";

/**
 * Displays an error message using appropriate UI components and logs it
 * @param error - The error to display
 * @param options - Display options
 */
export function displayError(
  error: Error | string, 
  options: ErrorDisplayOptions = {}
): string {
  // Default options
  const {
    title = "An error occurred",
    logToConsole = true,
    showToast = true,
    useCollector = true,
    notifyUser = true,
    // This will use the refactored types correctly
    component,
    source,
    details
  } = options;

  // Log to console if enabled
  if (logToConsole) {
    console.error("[Error Display]", error, details || {});
  }

  // Capture in error collector if enabled
  let errorId = "";
  if (useCollector) {
    errorId = errorCollector.captureError(error, {
      component,
      source,
      details
    });
  }

  // Show toast notification if enabled
  if (showToast && notifyUser) {
    const errorMessage = error instanceof Error ? error.message : error;
    
    toast.error(title, {
      description: errorMessage,
      duration: 5000
    });
  }

  // Return the error ID for reference
  return errorId;
}

/**
 * Display an async operation error with appropriate context
 * @param error - The error that occurred
 * @param operation - Description of the operation that failed
 * @param options - Additional display options
 */
export function displayOperationError(
  error: Error | string,
  operation: string,
  options: ErrorDisplayOptions = {}
): string {
  const title = `Failed to ${operation}`;
  
  return displayError(error, {
    title,
    logToConsole: true,
    showToast: true,
    ...options,
    source: options.source || 'operation'
  });
}
