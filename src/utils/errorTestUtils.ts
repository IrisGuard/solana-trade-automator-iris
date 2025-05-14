
import { errorCollector } from './error-handling/collector';
import { toast } from 'sonner';
import { displayError } from './errorUtils';

interface TestErrorOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  sendToChat?: boolean;
  useCollector?: boolean;
  component?: string;
}

export function generateTestError(message: string, options: TestErrorOptions = {}) {
  const error = new Error(message || 'Test error message');
  
  displayError(error, {
    title: 'Test Error',
    showToast: options.showToast,
    logToConsole: options.logToConsole,
    sendToChat: options.sendToChat,
    useCollector: options.useCollector,
    component: options.component || 'ErrorTestUtils'
  });
  
  console.log('Test error generated:', message);
}

export function generateTestErrorData(message: string) {
  return {
    message: message || 'Test error message',
    timestamp: Date.now(),
    id: `test_${Date.now()}`,
    source: 'client',
    component: 'Test'
  };
}

export function clearAllErrors() {
  // Clear errors from collector
  errorCollector.clearErrors();
  
  // Clear toasts
  toast.dismiss();
  
  console.log('All errors cleared');
}

export function generateVariousErrors(options: TestErrorOptions = {}) {
  // Network error simulation
  generateTestError('Network request failed: timeout after 30000ms', {
    ...options,
    component: 'NetworkService'
  });
  
  // Database error simulation
  generateTestError('Database query failed: relation "users" does not exist', {
    ...options,
    component: 'DatabaseService'
  });
  
  // Authentication error simulation
  generateTestError('Authentication failed: invalid token', {
    ...options,
    component: 'AuthService'
  });
  
  // API error simulation
  generateTestError('API Error: Rate limit exceeded', {
    ...options,
    component: 'APIService'
  });
}
