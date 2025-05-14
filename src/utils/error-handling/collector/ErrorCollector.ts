import { toast } from 'sonner';

export interface ErrorData {
  message: string;
  stack?: string;
  timestamp: Date;
  component?: string;
  code?: string;
  context?: Record<string, any>;
  handled: boolean;
}

export interface ErrorOptions {
  component?: string;
  code?: string;
  context?: Record<string, any>;
  silent?: boolean;
  showToast?: boolean;
  reportToServer?: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
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
    
    const errorData: ErrorData = {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date(),
      component: options.component,
      code: options.code,
      context: options.context,
      handled: true
    };

    // Add error to the collection
    this.errors.unshift(errorData);
    
    // Keep only the last maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log the error to console
    console.error('Error captured:', errorData);

    // Show toast notification if needed
    if (options.showToast !== false) {
      toast.error(errorMessage);
    }

    // Return a unique identifier for this error (timestamp for now)
    return errorData.timestamp.toISOString();
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

  clearError(timestamp: string): void {
    this.errors = this.errors.filter(error => error.timestamp.toISOString() !== timestamp);
  }
}

// Export singleton instance
export const errorCollector = new ErrorCollector();
