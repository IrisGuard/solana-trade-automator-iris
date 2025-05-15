
import { errorCollector } from './error-handling/collector';

export function clearAllErrors() {
  errorCollector.clearErrors();
  console.log('All errors have been cleared');
  return true;
}

export function generateTestError(message = 'This is a test error') {
  const error = new Error(message);
  errorCollector.captureError(error, {
    component: 'ErrorTest',
    source: 'errorTestUtils',
    details: { test: true }
  });
  return error;
}
