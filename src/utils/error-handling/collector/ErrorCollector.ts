import type { ErrorContext, ErrorOptions, CollectedError } from './types';

class ErrorCollectorClass {
  private errors: CollectedError[] = [];
  private maxErrors = 100;

  captureError(error: Error | string, context?: ErrorContext): string {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    const collectedError: CollectedError = {
      id: errorId,
      message: errorObj.message,
      stack: errorObj.stack,
      component: context?.component,
      source: context?.source || 'unknown',
      timestamp: new Date(),
      severity: context?.severity || 'medium',
      resolved: false,
      details: context?.details
    };

    // Add to errors array
    this.errors.unshift(collectedError);
    
    // Keep only the last maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console
    console.error(`[ErrorCollector] ${errorObj.message}`, {
      context,
      error: errorObj
    });

    return errorId;
  }

  getRecentErrors(limit = 10): CollectedError[] {
    return this.errors.slice(0, limit);
  }

  getErrorCount(): number {
    return this.errors.length;
  }

  clearErrors(): void {
    this.errors = [];
  }

  getErrorById(id: string): CollectedError | undefined {
    return this.errors.find(error => error.id === id);
  }

  markErrorResolved(id: string): boolean {
    const error = this.getErrorById(id);
    if (error) {
      error.resolved = true;
      return true;
    }
    return false;
  }
}

export const errorCollector = new ErrorCollectorClass();
