
import { TestErrorOptions } from './error-handling/collector/types';
import { errorCollector } from './error-handling/collector';

export const triggerTestError = async (errorType: string, options: TestErrorOptions = {}) => {
  const { message = 'Test error', component, details, simulateDelay } = options;

  if (simulateDelay) {
    await new Promise(resolve => setTimeout(resolve, simulateDelay));
  }

  const error = new Error(message);
  errorCollector.captureError(error, {
    component,
    source: 'test',
    details,
    severity: 'low'
  });

  throw error;
};

export const clearAllErrors = () => {
  errorCollector.clearErrors();
};
