
import { toast } from "sonner";
import { errorCollector, type ErrorData } from "./error-handling/collector";
import { setupGlobalErrorHandling } from "./error-handling/setupGlobalErrorHandling";

// Export the ErrorDisplayOptions type
export interface ErrorDisplayOptions {
  title?: string;
  showToast?: boolean;
  logToConsole?: boolean;
  useCollector?: boolean;
  sendToChat?: boolean;
  component?: string;
  method?: string;
  source?: string;
  details?: any;
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
export function displayError(error: Error | string, options?: ErrorDisplayOptions): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const errorMessage = typeof error === 'string' ? error : (error.message || "Άγνωστο σφάλμα");
  
  // Καταγραφή στην κονσόλα
  if (opts.logToConsole) {
    console.error(`${opts.title}: ${errorMessage}`, error);
  }
  
  // Προσθήκη στο συλλέκτη σφαλμάτων
  const errorData: ErrorData = {
    id: `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    message: errorMessage,
    stack: typeof error === 'string' ? undefined : error.stack,
    component: opts.component || 'unknown',
    source: opts.source || 'client',
    timestamp: Date.now(),
    details: {
      browserInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform
      },
      url: window.location.href,
      ...(opts.details || {})
    }
  };
  
  let errorId = '';
  if (opts.useCollector) {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    errorCollector.captureError(errorObj, {
      component: opts.component,
      source: opts.source,
      details: errorData.details,
    }).then(data => {
      errorId = data.id || '';
    }).catch(err => {
      console.error('Error capturing error:', err);
    });
  }
  
  // Εμφάνιση toast
  if (opts.showToast) {
    toast.error(`${opts.title}`, {
      description: errorMessage
    });
  }
  
  // Αποστολή στο chat support (μελλοντική λειτουργία)
  if (opts.sendToChat) {
    // Προς υλοποίηση μελλοντικά
    console.log("Αποστολή σφάλματος στο chat support");
  }
  
  return errorId;
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
