
import { ErrorCollector, ErrorData, ErrorOptions } from './types';

class ErrorCollectorImpl implements ErrorCollector {
  private errors: ErrorData[] = [];
  private readonly MAX_ERRORS = 50;

  captureError(error: Error | string, options: ErrorOptions = {}): string {
    const timestamp = new Date();
    const id = `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const errorData: ErrorData = {
      id,
      message: error instanceof Error ? error.message : error,
      timestamp,
      component: options.component,
      source: options.source,
      url: options.url,
      browserInfo: options.browserInfo,
      details: options.details,
      severity: options.severity
    };

    if (error instanceof Error) {
      errorData.stack = error.stack;
    }

    this.errors.unshift(errorData);
    
    if (this.errors.length > this.MAX_ERRORS) {
      this.errors = this.errors.slice(0, this.MAX_ERRORS);
    }

    console.error('[ErrorCollector]', errorData);
    return id;
  }

  getErrors(): ErrorData[] {
    return [...this.errors];
  }
  
  // Add alias for getErrors to support existing code
  getAllErrors(): ErrorData[] {
    return this.getErrors();
  }

  clearErrors(): void {
    this.errors = [];
  }
  
  // Add alias for clearErrors to support existing code
  clearAllErrors(): void {
    this.clearErrors();
  }

  hasCriticalErrors(): boolean {
    return this.errors.some(err => err.severity === 'critical');
  }

  getRecentErrors(count: number = 10): ErrorData[] {
    return this.errors.slice(0, Math.min(count, this.errors.length));
  }
}

export const errorCollector = new ErrorCollectorImpl();
export type { ErrorData, ErrorOptions };
