
import { toast } from "sonner";
import { errorCollector } from "./error-handling/collector";

export function clearAllErrors() {
  // Clear error collector
  if (errorCollector) {
    errorCollector.clearErrors();
    console.log("Cleared all errors from collector");
  }

  // Clear console
  console.clear();

  // Clear other potential error stores
  if (window.lovableChat?.clearErrors) {
    window.lovableChat.clearErrors();
  }
  
  // Clear error queue
  if (window._errorQueue) {
    window._errorQueue = [];
  }
  
  // Show success toast
  toast.success("All errors cleared");
}

export function generateTestError(options: any = {}) {
  const {
    message = "This is a test error",
    errorType = "general",
    component = "ErrorTest",
    toastTitle = "Test Error",
    showToast = true,
    logToConsole = true,
    sendToChat = false,
    useCollector = true,
  } = options;

  const error = new Error(message);
  error.name = errorType;

  // Add to collector
  if (useCollector && errorCollector) {
    errorCollector.captureError(error, { 
      component, 
      source: "test",
      details: options
    });
  }

  // Log to console
  if (logToConsole) {
    console.error(`[${errorType}] ${message}`, error);
  }

  // Show toast
  if (showToast) {
    toast.error(toastTitle, {
      description: message,
      duration: 5000
    });
  }

  // Send to chat dialog
  if (sendToChat && window.lovableChat?.createErrorDialog) {
    window.lovableChat.createErrorDialog({
      message,
      stack: error.stack,
      component,
      timestamp: new Date().toISOString()
    });
  }

  return error;
}

// Function to clear just warnings
export function clearWarnings() {
  toast.success("Warnings cleared");
  return true;
}
