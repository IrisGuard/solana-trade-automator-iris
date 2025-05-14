
/**
 * Error data collector for gathering and reporting errors
 */

export interface ErrorData {
  message: string;
  stack?: string;
  source: string;
  details?: Record<string, any>;
  timestamp?: number;
  component?: string;
}

export class ErrorCollector {
  private errors: ErrorData[] = [];
  private maxErrors: number = 50;
  private static instance: ErrorCollector;

  // Private constructor to enforce singleton
  private constructor() {}

  // Get the singleton instance
  public static getInstance(): ErrorCollector {
    if (!ErrorCollector.instance) {
      ErrorCollector.instance = new ErrorCollector();
    }
    return ErrorCollector.instance;
  }

  /**
   * Add an error to the collection
   */
  public addError(error: ErrorData): string {
    // Add timestamp if not present
    if (!error.timestamp) {
      error.timestamp = Date.now();
    }

    // Ensure we don't exceed the maximum number of errors
    if (this.errors.length >= this.maxErrors) {
      this.errors.shift(); // Remove oldest error
    }

    // Add the error to the collection
    this.errors.push(error);
    
    // Generate an ID for reference
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.warn(`Error collected [${errorId}]:`, error.message);
    
    return errorId;
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
    console.log('All collected errors cleared');
  }

  /**
   * Report errors to the server or logging service
   */
  public async reportErrors(): Promise<boolean> {
    if (this.errors.length === 0) {
      console.log('No errors to report');
      return true;
    }

    try {
      // Here you would implement your error reporting logic
      // For example, sending errors to a logging service
      console.log(`Reporting ${this.errors.length} errors to the server`);
      
      // Mock successful reporting
      console.log('Errors reported successfully');
      return true;
    } catch (e) {
      console.error('Failed to report errors:', e);
      return false;
    }
  }

  /**
   * Log an error and notify user
   */
  public logErrorAndNotify(error: Error, context?: Record<string, any>): string {
    const errorData: ErrorData = {
      message: error.message,
      stack: error.stack,
      source: 'application',
      details: context || {},
      timestamp: Date.now()
    };

    return this.addError(errorData);
  }
}

// Export a singleton instance
export const errorCollector = ErrorCollector.getInstance();
