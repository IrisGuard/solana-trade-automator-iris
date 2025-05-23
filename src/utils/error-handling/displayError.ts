
import { toast } from "sonner";
import { errorCollector } from "./collector";
import { ErrorContext } from "./collector/types";

interface DisplayErrorOptions extends ErrorContext {
  toastTitle?: string;
  toastDescription?: string;
  showToast?: boolean;
  sendToChat?: boolean;
  useCollector?: boolean;
}

export function displayError(error: Error, options: DisplayErrorOptions = {}) {
  const {
    toastTitle = "Error",
    toastDescription,
    showToast = true,
    sendToChat = false,
    useCollector = true,
    component,
    source,
    details,
    severity = 'medium',
  } = options;

  // Capture the error in the error collector
  if (useCollector) {
    errorCollector.captureError(error, {
      component,
      source,
      details,
      severity,
    });
  }

  // Show a toast notification if requested
  if (showToast) {
    toast.error(toastTitle, {
      description: toastDescription || error.message.substring(0, 100),
      duration: 5000,
    });
  }

  // Log the error to the console
  console.error(`[${component || 'App'}] ${error.message}`, error);

  // Send to chat window if requested
  if (sendToChat && window.lovableChat?.createErrorDialog) {
    window.lovableChat.createErrorDialog({
      message: error.message,
      stack: error.stack,
      component: component || 'unknown',
      timestamp: new Date().toISOString()
    });
  }

  return error;
}
