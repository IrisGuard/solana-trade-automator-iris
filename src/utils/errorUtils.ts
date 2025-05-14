import { toast } from "sonner";
import { errorCollector } from "./error-handling/collector";

interface DisplayErrorOptions {
  title?: string;
  duration?: number;
  showToast?: boolean;
  logToConsole?: boolean;
  sendToChat?: boolean;
  useCollector?: boolean;
}

/**
 * Displays an error message using toast and logs it to the console.
 * Also sends the error to the chat if sendToChat is true.
 * 
 * @param error The error to display
 * @param options Options for displaying the error
 */
export function displayError(
  error: Error | string,
  options: DisplayErrorOptions = {}
) {
  const {
    title = "Παρουσιάστηκε σφάλμα",
    duration = 5000,
    showToast = true,
    logToConsole = true,
    sendToChat = false,
    useCollector = false
  } = options;

  // Convert string errors to Error objects
  const errorObject = typeof error === "string" ? new Error(error) : error;
  const errorMessage = errorObject.message || "Άγνωστο σφάλμα";

  // Log to console if needed
  if (logToConsole) {
    console.error(`${title}:`, errorObject);
    console.error("Stack:", errorObject.stack);
  }

  // Show toast if needed
  if (showToast) {
    toast.error(title, {
      description: errorMessage,
      duration: duration
    });
  }

  // Collect error if needed
  if (useCollector) {
    errorCollector.addError({
      name: errorObject.name,
      message: errorMessage,
      stack: errorObject.stack,
      date: new Date(),
      source: "client"
    });
  }

  // Send to chat would be implemented here
  if (sendToChat) {
    // Implementation for sending to chat
  }
}

/**
 * Simple error logging function for service modules
 */
export function logError(message: string, source?: string, details?: any) {
  console.error(`[${source || 'unknown'}]`, message, details || '');
  
  // Add to error collector
  errorCollector.addError({
    message,
    stack: details?.stack || new Error().stack,
    timestamp: new Date().toISOString(),
    source: source || 'unknown',
    details: details ? JSON.stringify(details) : undefined
  });
  
  // Show toast in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    toast.error(`Error: ${message}`, {
      description: `Source: ${source || 'unknown'}`
    });
  }
}
