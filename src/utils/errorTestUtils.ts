
import { errorCollector } from './error-handling/collector';

export function generateTestError(message: string = 'Test Error', options: any = {}) {
  const error = new Error(message);
  
  // Add any additional properties to the error object
  if (options.code) error.name = options.code;
  
  // Capture the error using our collector
  const errorId = errorCollector.captureError(error, {
    component: options.component || 'TestComponent',
    source: options.source || 'test',
    details: options.details || { test: true },
    severity: options.severity || 'low',
    errorType: options.errorType
  });
  
  return { errorId, error };
}

export function clearAllErrors() {
  errorCollector.clearErrors();
}

export function simulateNetworkError() {
  const error = new Error('Network request failed');
  return errorCollector.captureError(error, {
    component: 'NetworkHandler',
    source: 'api',
    severity: 'medium'
  });
}
