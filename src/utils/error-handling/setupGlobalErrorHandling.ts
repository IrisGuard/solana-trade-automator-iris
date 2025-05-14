
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
  
  window.onunhandledrejection = (event) => {
    let error: Error;
    
    if (event.reason instanceof Error) {
      error = event.reason;
    } else {
      error = new Error(String(event.reason));
    }
    
    errorCollector.logErrorAndNotify(error, "UnhandledRejectionHandler");
    
    // Κλήση του προηγούμενου χειριστή αν υπάρχει
    if (typeof originalUnhandledRejection === 'function') {
      return originalUnhandledRejection(event);
    }
  };
  
  // Επιστρέφουμε μια συνάρτηση για την απενεργοποίηση των global handlers
  return () => {
    window.onerror = originalOnError;
    window.onunhandledrejection = originalUnhandledRejection;
  };
}
