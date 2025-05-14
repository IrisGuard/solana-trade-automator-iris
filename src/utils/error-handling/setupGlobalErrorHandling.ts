import { errorCollector } from "./collector";

export function setupGlobalErrorHandling(): () => void {
  // Χειρισμός μη επεξεργασμένων εξαιρέσεων
  const originalOnError = window.onerror;
  
  window.onerror = (message, source, lineno, colno, error) => {
    if (error instanceof Error) {
      errorCollector.logErrorAndNotify(error, "GlobalErrorHandler");
    } else {
      const genericError = new Error(String(message));
      errorCollector.logErrorAndNotify(genericError, "GlobalErrorHandler");
    }
    
    // Κλήση του προηγούμενου χειριστή αν υπάρχει
    if (typeof originalOnError === 'function') {
      return originalOnError(message, source, lineno, colno, error);
    }
    
    // Επιστρέφουμε false για να επιτρέψουμε την εκτέλεση των προεπιλεγμένων χειριστών σφαλμάτων
    return false;
  };
  
  // Χειρισμός μη επεξεργασμένων ασύγχρονων εξαιρέσεων
  const originalUnhandledRejection = window.onunhandledrejection;
  
  // Fix: Use addEventListener instead of direct assignment to maintain correct context
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    let error: Error;
    
    if (event.reason instanceof Error) {
      error = event.reason;
    } else {
      error = new Error(String(event.reason));
    }
    
    errorCollector.logErrorAndNotify(error, "UnhandledRejectionHandler");
  };
  
  // Add event listener for unhandled rejections
  window.addEventListener("unhandledrejection", handleUnhandledRejection);
  
  // Store original handler for cleanup if it exists
  if (typeof originalUnhandledRejection === 'function') {
    // Keep reference but don't use direct assignment
  }
  
  // Επιστρέφουμε μια συνάρτηση για την απενεργοποίηση των global handlers
  return () => {
    window.onerror = originalOnError;
    window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    // Don't need to restore original since we're using addEventListener
  };
}
