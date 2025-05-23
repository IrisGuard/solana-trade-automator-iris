import { ErrorContext, ErrorOptions, CollectedError } from './types';

class ErrorCollectorClass {
  private errors: CollectedError[] = [];
  private maxErrors = 100;

  captureError(error: Error, context: ErrorContext = {}, options: ErrorOptions = {}): void {
    const collectedError: CollectedError = {
      id: this.generateId(),
      message: error.message,
      stack: error.stack,
      component: context.component,
      source: context.source,
      timestamp: new Date(),
      severity: context.severity || 'medium',
      resolved: false,
      details: context.details
    };

    // Add error-specific properties if they exist
    if (options.errorCode) collectedError.details = { ...collectedError.details, errorCode: options.errorCode };
    if (options.context) collectedError.details = { ...collectedError.details, context: options.context };
    if (options.metadata) collectedError.details = { ...collectedError.details, metadata: options.metadata };
    if (options.status) collectedError.details = { ...collectedError.details, status: options.status };
    if (options.errorId) collectedError.details = { ...collectedError.details, errorId: options.errorId };

    this.errors.unshift(collectedError);
    
    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console for debugging
    console.error('[ErrorCollector]', error);

    // Call onError callback if provided
    if (options.onError) {
      try {
        options.onError(error);
      } catch (callbackError) {
        console.error('[ErrorCollector] Error in onError callback:', callbackError);
      }
    }
  }

  getErrors(): CollectedError[] {
    return [...this.errors];
  }

  getRecentErrors(minutes: number = 5): CollectedError[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.errors.filter(error => error.timestamp > cutoff);
  }

  clearErrors(): void {
    this.errors = [];
  }

  getErrorCount(): number {
    return this.errors.length;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export const errorCollector = new ErrorCollectorClass();
