
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
   * Add an error to the collector
   */
  public addError(errorData: ErrorData): void {
    this.errors.unshift(errorData);
    
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }
    
    // Log to console for development
    console.error('Error added:', errorData);
  }

  /**
   * Report all collected errors to a monitoring service
   * This is a placeholder implementation that will be enhanced later
   */
  public async reportErrors(): Promise<void> {
    if (this.errors.length === 0) {
      toast.info('Δεν υπάρχουν σφάλματα για αναφορά');
      return;
    }
    
    try {
      // In a real implementation, we would send the errors to a monitoring service
      // For now, we'll just log them to the console
      console.log('Reporting collected errors:', this.errors);
      
      // Display confirmation toast
      toast.success(`Αναφέρθηκαν ${this.errors.length} σφάλματα επιτυχώς`);
      
      // In a production environment, we might clear errors after reporting
      // this.clearErrors();
    } catch (error) {
      console.error('Error reporting collected errors:', error);
      toast.error('Σφάλμα κατά την αναφορά σφαλμάτων');
    }
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
