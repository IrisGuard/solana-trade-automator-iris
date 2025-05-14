
export interface ErrorData {
  message: string;
  source: 'client' | 'server' | 'network';
  timestamp?: Date;
  stack?: string;
  details?: Record<string, any>;
  component?: string;
  url?: string;
  browserInfo?: {
    userAgent: string;
    language: string;
    platform: string;
  };
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
   * @returns A unique error code for reference
   */
  addError(error: ErrorData): string {
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
    
    // Generate a simple error code
    const errorCode = `ERR-${Math.random().toString(36).substring(2, 8)}`;
    return errorCode;
  }
  
  /**
   * Log an error and optionally notify the user
   * @param error The error to log
   * @param source The source component/module name
   */
  logErrorAndNotify(error: Error, source: string): void {
    const errorData: ErrorData = {
      message: error.message,
      source: 'client',
      stack: error.stack,
      component: source
    };
    
    this.addError(errorData);
    console.error(`[${source}]`, error);
  }
  
  /**
   * Report all collected errors to a monitoring service or chat interface
   */
  async reportErrors(): Promise<void> {
    if (this.errors.length === 0) {
      console.log('No errors to report');
      return;
    }
    
    console.log(`Reporting ${this.errors.length} errors...`);
    
    try {
      // In a production app, this would send errors to a monitoring service
      const data = {
        errors: this.getErrors(),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };
      
      console.log('Reporting errors:', data);
      
      // For now just log to console, in a real app this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async operation
      
      console.log('Errors reported successfully');
    } catch (error) {
      console.error('Failed to report errors:', error);
    }
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
