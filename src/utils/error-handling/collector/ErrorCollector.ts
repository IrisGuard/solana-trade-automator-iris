
import { ErrorData, ErrorOptions, ErrorCollector } from './types';

// Implement the ErrorCollector interface
export class ErrorCollectorImpl implements ErrorCollector {
  private errors: ErrorData[] = [];
  private errorCallback: ((error: ErrorData) => void) | null = null;
  private readonly maxErrors: number = 100;

  captureError(error: Error | string, options?: ErrorOptions): void {
    const errorData: ErrorData = {
      id: this.generateErrorId(),
      timestamp: new Date(),
      error: typeof error === 'string' ? new Error(error) : error,
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? new Error(error).stack : error.stack,
      ...options
    };

    this.errors.push(errorData);
    this.trimErrors();
    
    if (this.errorCallback) {
      this.errorCallback(errorData);
    }
  }

  getErrors(type?: string): ErrorData[] {
    if (type) {
      return this.errors.filter(error => error.type === type);
    }
    return [...this.errors];
  }

  // Alias for getErrors to maintain compatibility
  getAllErrors(type?: string): ErrorData[] {
    return this.getErrors(type);
  }

  clearErrors(type?: string): void {
    if (type) {
      this.errors = this.errors.filter(error => error.type !== type);
    } else {
      this.errors = [];
    }
  }

  // Alias for clearErrors to maintain compatibility
  clearAllErrors(type?: string): void {
    this.clearErrors(type);
  }

  setErrorCallback(callback: (error: ErrorData) => void): void {
    this.errorCallback = callback;
  }

  private generateErrorId(): string {
    return `error-${new Date().getTime()}-${Math.floor(Math.random() * 10000)}`;
  }

  private trimErrors(): void {
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }
  }
}

export const errorCollector = new ErrorCollectorImpl();
