
import { toast } from 'sonner';
import { errorCollector } from './error-handling/collector';
import { TestErrorOptions } from './error-handling/types';

/**
 * Generate various test errors for testing error handling mechanisms
 */
export function generateVariousErrors(options: TestErrorOptions = {}): void {
  const {
    component = 'ErrorTestUtils',
    message = 'This is a test error',
    useToast = true,
    isAsync = false,
    severity = 'error',
    code = 'TEST_ERROR'
  } = options;

  // Create a custom error with additional properties
  const error = new Error(message) as any;
  error.code = code;
  error.component = component;
  
  // Add to error collector
  errorCollector.captureError(error, {
    component,
    details: { testGenerated: true, severity, code },
    source: 'test'
  });
  
  // Show toast if requested
  if (useToast) {
    if (severity === 'error') {
      toast.error(message, {
        description: `Test error from ${component}`
      });
    } else if (severity === 'warning') {
      toast.warning(message, {
        description: `Test warning from ${component}`
      });
    } else {
      toast.info(message, {
        description: `Test info from ${component}`
      });
    }
  }

  // Log to console
  console[severity](
    `[${component}] Test ${severity}: ${message}`,
    { testGenerated: true, code }
  );

  // Generate an async error if requested
  if (isAsync) {
    setTimeout(() => {
      const asyncError = new Error(`Async ${message}`);
      
      // Add to error collector
      errorCollector.captureError(asyncError, {
        component: `${component}Async`,
        details: { testGenerated: true, severity, code, async: true },
        source: 'test-async'
      });
      
      console[severity](
        `[${component}Async] Async Test ${severity}: ${message}`,
        { testGenerated: true, code, async: true }
      );
      
      if (useToast) {
        toast.error(`Async ${message}`, {
          description: `Async test from ${component}`
        });
      }
    }, 1000);
  }
}

/**
 * Clear all test errors
 */
export function clearAllErrors(): void {
  errorCollector.clearAll();
  toast.success('All errors cleared');
}
