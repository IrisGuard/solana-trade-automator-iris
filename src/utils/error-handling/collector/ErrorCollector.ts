export interface ErrorData {
  message: string;
  source: 'client' | 'server' | 'network';
  timestamp?: Date;
  stack?: string;
  details?: Record<string, any>;
}

/**
 * A class that collects errors for logging and reporting
 */
export class ErrorCollector {
  private errors: ErrorData[] = [];
  private maxErrors: number = 50;
  
  /**
   * Add an error to the collector
   * @param error The error data to add
   */
  addError(error: ErrorData): void {
    // Add timestamp if not provided
    const errorWithTimestamp = {
      ...error,
      timestamp: error.timestamp || new Date()
    };
    
    this.errors.unshift(errorWithTimestamp);
    
    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }
    
    // Log to console for debugging
    console.error('Error collected:', errorWithTimestamp);
  }
  
  /**
   * Get all collected errors
   */
  getErrors(): ErrorData[] {
    return [...this.errors];
  }
  
  /**
   * Clear all collected errors
   */
  clearErrors(): void {
    this.errors = [];
  }
  
  /**
   * Get errors filtered by source
   * @param source The source to filter by
   */
  getErrorsBySource(source: ErrorData['source']): ErrorData[] {
    return this.errors.filter(error => error.source === source);
  }
  
  /**
   * Get the count of errors
   */
  getErrorCount(): number {
    return this.errors.length;
  }
}

// Create a singleton instance
export const errorCollector = new ErrorCollector();
