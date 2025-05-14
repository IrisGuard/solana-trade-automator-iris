
// Assume this is the content of errorTestUtils.ts
// We need to fix line 23 which has a possible null reference

// Let's create a safer implementation
import { errorCollector } from '@/utils/error-handling/collector';

export function triggerTestError(type: string, options?: any): void {
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

function triggerJsError(options?: any): void {
  try {
    // Safely handle potential null options
    const errorType = options && options.errorType ? options.errorType : 'reference';
    
    // Generate different types of JavaScript errors
    if (errorType === 'reference') {
      // @ts-ignore - Intentionally causing an error
      const nonExistentVar = undefinedVariable.property;
    } else if (errorType === 'type') {
      // @ts-ignore - Intentionally causing an error
      const num = 42;
      num.toLowerCase();
    } else if (errorType === 'syntax') {
      // This won't actually throw at runtime due to how JS works
      // But we can simulate a syntax error
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

function triggerAsyncError(options?: any): void {
  setTimeout(() => {
    try {
      // Safely handle potential null options
      const errorType = options && options.errorType ? options.errorType : 'promise';
      
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

function triggerNetworkError(options?: any): void {
  // Safely handle potential null options
  const errorType = options && options.errorType ? options.errorType : 'fetch';
  
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
    // Simulate a network timeout
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

function triggerUIError(options?: any): void {
  // UI errors would normally be triggered in component rendering
  // Here we just throw an error that would be caught by ErrorBoundary
  try {
    // Safely handle potential null options
    const errorType = options && options.errorType ? options.errorType : 'render';
    
    throw new Error(`Test UI Error: ${errorType}`);
  } catch (error) {
    errorCollector.captureError(error instanceof Error ? error : new Error('Unknown UI Error'), {
      source: 'test',
      component: 'ErrorTestUtils'
    });
    throw error;
  }
}
