
import { toast } from 'sonner';

// Define the error data type
export interface ErrorData {
  message: string;
  stack?: string;
  code?: string | number;
  timestamp: number;
  context?: Record<string, any>;
}

/**
 * ErrorCollector - Collects application errors for later processing
 */
export class ErrorCollector {
  private static instance: ErrorCollector;
  private errors: ErrorData[] = [];
  private maxErrors: number = 50;
  private showToasts: boolean = true;

  private constructor() {
    // Singleton initialization
  }

  public static getInstance(): ErrorCollector {
    if (!ErrorCollector.instance) {
      ErrorCollector.instance = new ErrorCollector();
    }
    return ErrorCollector.instance;
  }

  /**
   * Collect an error with optional context
   */
  public collect(error: Error | string, context?: Record<string, any>): void {
    const errorData: ErrorData = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      timestamp: Date.now(),
      context
    };

    this.errors.unshift(errorData);
    
    // Trim the errors array if it exceeds the maximum size
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Show toast notification if enabled
    if (this.showToasts) {
      toast.error(errorData.message, {
        description: context ? JSON.stringify(context) : undefined
      });
    }

    // Log to console for development
    console.error('Error collected:', errorData);
  }

  /**
   * Get all collected errors
   */
  public getErrors(): ErrorData[] {
    return [...this.errors];
  }

  /**
   * Clear all collected errors
   */
  public clearErrors(): void {
    this.errors = [];
  }

  /**
   * Configure the error collector
   */
  public configure(options: { maxErrors?: number; showToasts?: boolean }): void {
    if (options.maxErrors !== undefined) {
      this.maxErrors = options.maxErrors;
    }
    if (options.showToasts !== undefined) {
      this.showToasts = options.showToasts;
    }
  }

  /**
   * Get the latest error, if any
   */
  public getLatestError(): ErrorData | null {
    return this.errors.length > 0 ? this.errors[0] : null;
  }
}

// Export a singleton instance of the error collector
export const errorCollector = ErrorCollector.getInstance();

// Export default for backward compatibility
export default errorCollector;
