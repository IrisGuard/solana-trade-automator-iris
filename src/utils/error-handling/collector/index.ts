
import { ErrorCollector, ErrorData, ErrorContext } from './types';

class SimpleErrorCollector implements ErrorCollector {
  private errors: ErrorData[] = [];

  captureError(error: any, context?: ErrorContext): void {
    const errorData: ErrorData = {
      message: error.message || String(error),
      stack: error.stack,
      timestamp: new Date(),
      component: context?.component,
      source: context?.source || 'client',
      error: error instanceof Error ? error : undefined,
      data: context?.details
    };
    
    this.errors.push(errorData);
    console.error('Error captured:', errorData);
  }

  captureException(error: Error, context?: ErrorContext): void {
    this.captureError(error, context);
  }

  getErrors(): ErrorData[] {
    return [...this.errors];
  }

  getRecentErrors(limit: number = 10): ErrorData[] {
    return this.errors.slice(-limit);
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
