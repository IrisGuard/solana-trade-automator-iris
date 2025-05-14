
import { toast } from 'sonner';
import { ErrorOptions } from '../types';

export interface ErrorData {
  id?: string;
  message: string;
  stack?: string;
  timestamp: Date | string | number;
  component?: string;
  code?: string;
  context?: Record<string, any>;
  handled: boolean;
  source?: string;
}

class ErrorCollector {
  private errors: ErrorData[] = [];
  private maxErrors: number = 100;

  constructor() {
    // Initialize error collector
    console.log('Error collector initialized');
  }

  captureError(error: Error | string, options: ErrorOptions = {}): string {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? undefined : error.stack;
    const timestamp = new Date();
    const id = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const errorData: ErrorData = {
      id,
      message: errorMessage,
      stack: errorStack,
      timestamp,
      component: options.component,
      code: options.code,
      context: options.context,
      handled: true,
      source: options.component || 'unknown'
    };

    // Add error to the collection
    this.errors.unshift(errorData);
    
    // Keep only the last maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log the error to console
    if (!options.silent) {
      console.error('Error captured:', errorData);
    }

    // Show toast notification if needed
    if (options.showToast !== false) {
      toast.error(options.title || errorMessage);
    }

    // Return the unique identifier for this error
    return id;
  }

  getAllErrors(): ErrorData[] {
    return [...this.errors];
  }

  getRecentErrors(count: number = 10): ErrorData[] {
    return this.errors.slice(0, count);
  }

  clearAllErrors(): void {
    this.errors = [];
  }

  clearError(id: string): void {
    this.errors = this.errors.filter(error => error.id !== id);
  }
}

// Export singleton instance
export const errorCollector = new ErrorCollector();
