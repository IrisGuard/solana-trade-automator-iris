
import { errorCollector } from './error-handling/collector';
import { ErrorOptions, TestErrorOptions } from './error-handling/types';

/**
 * Παράγει ένα απλό σφάλμα για δοκιμές
 */
export function generateTestError(message: string, options?: ErrorOptions): void {
  const error = new Error(message);
  error.name = "TestError";
  
  // Καταγραφή του σφάλματος στον collector
  errorCollector.captureError(error, {
    component: options?.component || 'TestComponent',
    details: options?.details
  });
  
  // Εμφάνιση στην κονσόλα για εύκολη αναγνώριση
  console.error("Test Error Generated:", message, options);
}

/**
 * Παράγει διάφορους τύπους σφαλμάτων ανάλογα με τις επιλογές
 */
export function generateVariousErrors(options?: TestErrorOptions): void {
  const { errorType = 'reference', component = 'ErrorTestUtils', details = {}, source = 'test' } = options || {};
  
  let error: Error;
  
  // Δημιουργία διαφορετικών τύπων σφαλμάτων βάσει του errorType
  switch (errorType) {
    case 'reference':
      error = new ReferenceError('Test ReferenceError - Undefined variable referenced');
      break;
    case 'type':
      error = new TypeError('Test TypeError - Operation on incompatible type');
      break;
    case 'syntax':
      error = new SyntaxError('Test SyntaxError - Invalid syntax');
      break;
    case 'promise':
      Promise.reject(new Error('Test Promise Rejection'));
      error = new Error('Test Promise Error - Uncaught promise rejection');
      break;
    case 'async':
      setTimeout(() => {
        const asyncError = new Error('Test Async Error - Error in async operation');
        errorCollector.captureError(asyncError, { component, details: { ...details, async: true } });
      }, 100);
      return;
    case 'timeout':
      error = new Error('Test Timeout Error - Operation timed out');
      break;
    case 'render':
      error = new Error('Test Render Error - Failed to render component');
      break;
    case 'prop':
      error = new Error('Test Prop Error - Missing required prop');
      break;
    case 'state':
      error = new Error('Test State Error - Invalid state update');
      break;
    case 'network':
      const status = details.status || 500;
      error = new Error(`Test Network Error - HTTP ${status}`);
      error.name = 'NetworkError';
      break;
    default:
      error = new Error('Test Generic Error');
  }
  
  // Προσθήκη επιπλέον ιδιοτήτων στο σφάλμα
  error.stack = `Error generated from: ${component}\n   at ErrorTestUtils.generateVariousErrors (errorTestUtils.ts:42)\n   at TestFunction (test.js:10)\n   at UserAction (app.js:25)`;
  
  // Καταγραφή του σφάλματος
  errorCollector.captureError(error, { component, details });
  
  // Εμφάνιση στην κονσόλα για εύκολη αναγνώριση
  console.error(`Test ${errorType} Error Generated:`, error.message, { component, details, source });
}

/**
 * Καθαρίζει όλα τα σφάλματα από τον collector
 */
export function clearAllErrors(): void {
  errorCollector.clearAllErrors();
  console.log("All errors cleared");
}

/**
 * Παράγει δεδομένα σφάλματος για δοκιμές
 */
export function generateTestErrorData(message: string, options?: any) {
  return {
    message,
    stack: "Error: " + message + "\n    at TestFunction (test.js:10)\n    at UserAction (app.js:25)",
    timestamp: Date.now(),
    component: options?.component || "TestComponent",
    details: options?.details || { source: "test" }
  };
}
