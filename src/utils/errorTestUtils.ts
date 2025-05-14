
import { errorCollector } from "./error-handling/collector";

export interface TestErrorOptions {
  message?: string;
  isAsync?: boolean;
  useToast?: boolean;
  severity?: 'critical' | 'warning' | 'info';
  code?: string;
}

export function testJavascriptError(options: TestErrorOptions = {}) {
  const message = options.message || 'This is a test JavaScript error';
  try {
    const undefinedFunction = null as any;
    undefinedFunction();
  } catch (error) {
    if (error instanceof Error) {
      errorCollector.reportError(error, {
        message,
        severity: options.severity || 'info',
        code: options.code || 'TEST_JS_ERROR',
        useToast: options.useToast ?? true
      });
    }
  }
}

export function testAsyncError(options: TestErrorOptions = {}) {
  const message = options.message || 'This is a test async error';
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Intentionally cause an error
        const undefinedObject = undefined as any;
        undefinedObject.someMethod();
      } catch (error) {
        if (error instanceof Error) {
          errorCollector.reportError(error, { 
            message, 
            severity: options.severity || 'warning',
            code: options.code || 'TEST_ASYNC_ERROR',
            useToast: options.useToast ?? true 
          });
        }
        resolve(true);
      }
    }, 500);
  });
}

export function testNetworkError(options: TestErrorOptions = {}) {
  const message = options.message || 'This is a test network error';
  
  fetch('https://non-existent-url-for-testing-123456789.com')
    .then(() => {
      console.log('This should never execute');
    })
    .catch(error => {
      errorCollector.reportError(new Error('Network request failed'), {
        message,
        severity: options.severity || 'critical',
        code: options.code || 'TEST_NETWORK_ERROR',
        useToast: options.useToast ?? true
      });
    });
}

export function testUIError(options: TestErrorOptions = {}) {
  const message = options.message || 'This is a test UI error';

  try {
    // Simulate a UI rendering error
    document.querySelector('#non-existent-element')!.appendChild(document.createElement('div'));
  } catch (error) {
    if (error instanceof Error) {
      errorCollector.reportError(error, {
        message,
        severity: options.severity || 'warning',
        code: options.code || 'TEST_UI_ERROR',
        useToast: options.useToast ?? true
      });
    }
  }
}

export function clearErrors() {
  errorCollector.clearErrors();
}
