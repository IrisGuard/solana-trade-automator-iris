import { ErrorContext, ErrorData, CollectedError, ErrorCollector } from './types';

class SimpleErrorCollector implements ErrorCollector {
  private errors: CollectedError[] = [];

  captureError(error: Error | string, context?: ErrorContext): void {
    const errorData: CollectedError = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      timestamp: new Date(),
      component: context?.component,
      source: context?.source,
      severity: context?.severity,
      details: context?.details,
      resolved: false
    };
    
    this.errors.unshift(errorData);
    
    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(0, 100);
    }
    
    console.error('Error captured:', errorData);
  }

  getRecentErrors(): CollectedError[] {
    return this.errors.slice(0, 10);
  }

  getErrorCount(): number {
    return this.errors.length;
  }

  clearErrors(): void {
    this.errors = [];
  }
}

export const errorCollector = new SimpleErrorCollector();

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.errorCollector = errorCollector;
}
