
import { displayError } from './error-handling/displayError';
import { errorCollector } from './error-handling/collector';

export interface TestErrorOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  component?: string;
  useCollector?: boolean;
}

export const generateVariousErrors = (options: TestErrorOptions) => {
  const { showToast = true, logToConsole = true, component = 'ErrorTest', useCollector = true } = options;
  
  // Δημιουργία τυπικού σφάλματος JavaScript
  const error = new Error('Δοκιμαστικό σφάλμα από το ErrorTestPanel');
  
  if (useCollector) {
    // Χρήση του errorCollector
    errorCollector.captureError(error, {
      component,
      details: { source: 'Test' },
      source: 'test'
    });
  }
  
  // Εμφάνιση σφάλματος με τις ζητούμενες επιλογές
  displayError(error, {
    showToast,
    logToConsole,
    component
  });
};

export const clearAllErrors = () => {
  errorCollector.clearAllErrors();
};
