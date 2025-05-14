
import { ErrorOptions } from './error-handling/types';
import { errorCollector } from './error-handling/collector';
import { v4 as uuidv4 } from 'uuid';

/**
 * Πυροδοτεί ένα δοκιμαστικό σφάλμα για σκοπούς ελέγχου
 */
export function triggerTestError(options?: ErrorOptions): void {
  const testError = new Error(options?.message || 'This is a test error');
  
  // Προσθήκη επιπλέον πληροφοριών στο σφάλμα
  if (options?.source) {
    (testError as any).source = options.source;
  }
  
  if (options?.component) {
    (testError as any).component = options.component;
  }

  // Καταγραφή του σφάλματος
  errorCollector.captureError(testError, options);
  
  // Εμφάνιση στην κονσόλα
  if (options?.logToConsole !== false) {
    console.error('Test Error:', testError);
  }
  
  // Ενημέρωση του UI αν χρειάζεται
  if (options?.sendToUI) {
    const errorEvent = new CustomEvent('app-error', { 
      detail: { 
        error: testError, 
        id: uuidv4(),
        timestamp: new Date().toISOString()
      } 
    });
    window.dispatchEvent(errorEvent);
  }
}

/**
 * Καθαρίζει όλα τα καταγεγραμμένα σφάλματα
 */
export function clearAllErrors(): void {
  errorCollector.clearAllErrors();
  console.log('All errors have been cleared');
}
