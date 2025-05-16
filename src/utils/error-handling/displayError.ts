
import { toast } from "sonner";
import { errorCollector } from "./collector";

export interface DisplayErrorOptions {
  component?: string;
  toastTitle?: string;
  showToast?: boolean;
  logToConsole?: boolean;
  sendToChat?: boolean;
  useCollector?: boolean;
  silent?: boolean;
  source?: string; // Προσθέτουμε την ιδιότητα source
  severity?: string;
  details?: any;
}

/**
 * Display an error with various options
 */
export function displayError(error: Error, options: DisplayErrorOptions = {}) {
  const {
    component = "unknown",
    toastTitle = "Σφάλμα",
    showToast = true,
    logToConsole = true,
    sendToChat = false,
    useCollector = true,
    silent = false,
    source = "client", // Προσθέτουμε προεπιλεγμένη τιμή
    severity = "medium"
  } = options;

  // Log to console
  if (logToConsole && !silent) {
    console.error(`[${component}] Error:`, error);
  }
  
  // Use error collector
  if (useCollector) {
    errorCollector.captureError(error, {
      component,
      source,
      severity: severity as any
    });
  }
  
  // Show toast
  if (showToast && !silent) {
    toast.error(toastTitle, {
      description: error.message,
      duration: 5000
    });
  }
  
  // Send to chat helper
  if (sendToChat && window.lovableChat?.createErrorDialog && !silent) {
    window.lovableChat.createErrorDialog({
      title: toastTitle,
      message: error.message,
      stack: error.stack,
      component
    });
  }
}

/**
 * Display a success message
 */
export function displaySuccess(message: string, title: string = "Επιτυχία") {
  toast.success(title, {
    description: message,
    duration: 3000
  });
}
