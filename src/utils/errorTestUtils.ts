
import { errorCollector } from '@/utils/error-handling/collector';

// Export functions needed by other files
export function clearAllErrors(): void {
  errorCollector.clearErrors();
}

export function getAllErrors() {
  return errorCollector.getErrors();
}

export interface TestErrorOptions {
  errorType?: string;
  message?: string;
  details?: Record<string, any>;
}

export function triggerTestError(type: string, options?: TestErrorOptions): void {
  switch (type) {
    case 'js':
      triggerJsError(options);
      break;
    case 'async':
      triggerAsyncError(options);
      break;
    case 'network':
      triggerNetworkError(options);
      break;
    case 'ui':
      triggerUIError(options);
      break;
    default:
      console.error('Unknown error type:', type);
  }
}

export function generateVariousErrors(count: number = 1): void {
  const errorTypes = ['js', 'async', 'network', 'ui'];
  for (let i = 0; i < count; i++) {
    const randomType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    try {
      triggerTestError(randomType);
    } catch (e) {
      // Catch and ignore to prevent test errors from stopping execution
      console.log(`Generated test error: ${randomType}`);
    }
  }
}

function triggerJsError(options?: TestErrorOptions): void {
  try {
    const errorType = options?.errorType || 'reference';
    
    if (errorType === 'reference') {
      // @ts-ignore - Intentionally causing an error
      const nonExistentVar = undefinedVariable.property;
    } else if (errorType === 'type') {
      // Create an intentional type error that won't be caught by TS compiler
      // @ts-ignore - Intentionally causing an error
      const num: any = 42;
      console.log(num.doesNotExist());
    } else if (errorType === 'syntax') {
      try {
        // @ts-ignore - Intentionally causing an error
        eval('const x = {,};');
      } catch (e) {
        throw new SyntaxError('Test syntax error');
      }
    }
  } catch (error) {
    errorCollector.captureError(error instanceof Error ? error : new Error('Unknown JavaScript Error'), {
      source: 'test',
      component: 'ErrorTestUtils'
    });
    throw error;
  }
}

function triggerAsyncError(options?: TestErrorOptions): void {
  setTimeout(() => {
    try {
      const errorType = options?.errorType || 'promise';
      
      if (errorType === 'promise') {
        Promise.reject(new Error('Test Promise Rejection'));
      } else {
        throw new Error('Test Async Error');
      }
    } catch (error) {
      errorCollector.captureError(error instanceof Error ? error : new Error('Unknown Async Error'), {
        source: 'test',
        component: 'ErrorTestUtils'
      });
    }
  }, 100);
}

function triggerNetworkError(options?: TestErrorOptions): void {
  const errorType = options?.errorType || 'fetch';
  
  if (errorType === 'fetch') {
    fetch('https://non-existent-domain-123456.xyz')
      .then(response => response.json())
      .catch(error => {
        errorCollector.captureError(error, {
          source: 'test',
          component: 'ErrorTestUtils'
        });
      });
  } else if (errorType === 'timeout') {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 100);
    
    fetch('https://httpstat.us/200?sleep=5000', { signal: controller.signal })
      .then(response => {
        clearTimeout(timeoutId);
        return response.json();
      })
      .catch(error => {
        errorCollector.captureError(error, {
          source: 'test',
          component: 'ErrorTestUtils'
        });
      });
  }
}

function triggerUIError(options?: TestErrorOptions): void {
  try {
    const errorType = options?.errorType || 'render';
    
    throw new Error(`Test UI Error: ${errorType}`);
  } catch (error) {
    errorCollector.captureError(error instanceof Error ? error : new Error('Unknown UI Error'), {
      source: 'test',
      component: 'ErrorTestUtils'
    });
    throw error;
  }
}
