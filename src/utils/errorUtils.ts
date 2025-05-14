
import { toast } from "sonner";
import { errorCollector, type ErrorData } from "./error-handling/collector";
import { setupGlobalErrorHandling } from "./error-handling/setupGlobalErrorHandling";

interface ErrorDisplayOptions {
  title?: string;
  showToast?: boolean;
  logToConsole?: boolean;
  useCollector?: boolean;
  sendToChat?: boolean;
  component?: string;
}

const DEFAULT_OPTIONS: ErrorDisplayOptions = {
  title: "Σφάλμα",
  showToast: true,
  logToConsole: true,
  useCollector: true,
  sendToChat: false,
  component: undefined
};

/**
 * Κεντρική συνάρτηση για εμφάνιση και διαχείριση σφαλμάτων
 */
export function displayError(error: Error, options?: ErrorDisplayOptions): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const errorMessage = error.message || "Άγνωστο σφάλμα";
  
  // Καταγραφή στην κονσόλα
  if (opts.logToConsole) {
    console.error(`${opts.title}: ${errorMessage}`, error);
  }
  
  // Προσθήκη στο συλλέκτη σφαλμάτων
  const errorData: ErrorData = {
    message: errorMessage,
    stack: error.stack,
    source: 'client',
    component: opts.component,
    details: {
      browserInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform
      },
      url: window.location.href
    }
  };
  
  let errorCode = '';
  if (opts.useCollector) {
    errorCode = errorCollector.addError(errorData);
  }
  
  // Εμφάνιση toast
  if (opts.showToast) {
    toast.error(`${opts.title}`, {
      description: errorMessage,
      ...(errorCode ? { id: errorCode } : {})
    });
  }
  
  // Αποστολή στο chat support (μελλοντική λειτουργία)
  if (opts.sendToChat) {
    // Προς υλοποίηση μελλοντικά
    console.log("Αποστολή σφάλματος στο chat support");
  }
  
  return errorCode || '';
}

export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (typeof error === 'object' && error !== null) {
    return JSON.stringify(error);
  }
  
  return 'Άγνωστο σφάλμα';
}

// Export the setupGlobalErrorHandling function
export { setupGlobalErrorHandling };
