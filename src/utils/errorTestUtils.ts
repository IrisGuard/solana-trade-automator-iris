
import { displayError } from './error-handling/displayError';
import { errorCollector } from './error-handling/collector';

interface TestErrorOptions {
  message: string;
  errorType: string;
  component?: string;
  details?: any;
  toastTitle?: string;
  showToast?: boolean;
  sendToChat?: boolean;
  useCollector?: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export function generateTestError(options: TestErrorOptions) {
  const {
    message,
    errorType,
    component = 'TestComponent',
    details,
    toastTitle = 'Test Error',
    showToast = true,
    sendToChat = false,
    useCollector = true,
    severity = 'medium'
  } = options;

  const error = new Error(message);
  
  displayError(error, {
    title: toastTitle,
    showToast,
    logToConsole: true,
    useCollector,
    component,
    severity,
    details: {
      errorType,
      ...details
    }
  });
}

export function clearAllErrors() {
  // Clear error collector
  errorCollector.clearErrors();
  
  // Clear localStorage errors if any
  try {
    localStorage.removeItem('app_errors');
    localStorage.removeItem('attempted_reload');
  } catch (e) {
    console.error('Error clearing localStorage:', e);
  }
  
  // Dispatch clear errors event
  window.dispatchEvent(new CustomEvent('lovable-clear-errors'));
  
  console.log('All errors cleared');
}
