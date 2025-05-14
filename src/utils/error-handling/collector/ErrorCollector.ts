
/**
 * ErrorCollector - A utility class for collecting and managing errors
 * in a centralized location.
 */

// Interface for error data
export interface ErrorData {
  message: string;
  stack?: string;
  source?: string;
  component?: string;
  details?: any;
  timestamp?: number;
  url?: string;
  error?: Error;
  handled?: boolean;
  [key: string]: any; // Allow additional custom properties
}

/**
 * ErrorCollector class that provides methods to collect and manage errors
 */
class ErrorCollector {
  private errors: Map<string, ErrorData> = new Map();
  private static instance: ErrorCollector;
  private maxErrors: number = 100;
  
  // Private constructor for singleton pattern
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
   * @param data Error data to add
   * @returns String ID of the added error
   */
  public addError(data: ErrorData): string {
    // Generate a unique ID for the error
    const id = `error-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Add timestamp if not provided
    if (!data.timestamp) {
      data.timestamp = Date.now();
    }
    
    // Store error in the map
    this.errors.set(id, data);
    
    // Prune old errors if we've exceeded the max
    this.pruneErrors();
    
    // Log the error to console
    console.error(`Error collected [${id}]:`, data.message);
    
    return id;
  }
  
  /**
   * Get an error by ID
   * @param id ID of the error to retrieve
   * @returns ErrorData or undefined if not found
   */
  public getError(id: string): ErrorData | undefined {
    return this.errors.get(id);
  }
  
  /**
   * Get all collected errors
   * @returns Array of all error data
   */
  public getAllErrors(): ErrorData[] {
    return Array.from(this.errors.values());
  }
  
  /**
   * Clear all collected errors
   */
  public clearErrors(): void {
    this.errors.clear();
  }
  
  /**
   * Remove old errors if over max limit
   */
  private pruneErrors(): void {
    if (this.errors.size > this.maxErrors) {
      // Get oldest errors first
      const sortedIds = Array.from(this.errors.entries())
        .sort((a, b) => (a[1].timestamp || 0) - (b[1].timestamp || 0))
        .map(entry => entry[0]);
      
      // Remove oldest errors
      const toRemove = sortedIds.slice(0, this.errors.size - this.maxErrors);
      toRemove.forEach(id => this.errors.delete(id));
    }
  }
  
  /**
   * Log error and notify relevant systems
   * @param error Error object or message
   * @param context Additional context information
   * @returns String ID of the reported error
   */
  public logErrorAndNotify(error: Error | string, context: any = {}): string {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    const errorData: ErrorData = {
      message: errorObj.message,
      stack: errorObj.stack,
      ...context,
      timestamp: Date.now()
    };
    
    return this.addError(errorData);
  }
  
  /**
   * Report errors to monitoring system
   * @param errors Array of error data to report
   */
  public reportErrors(errors: ErrorData[]): void {
    // Implementation would send errors to monitoring system
    console.log(`Reporting ${errors.length} errors to monitoring system`);
    
    // Mark errors as reported
    errors.forEach(error => {
      error.reported = true;
    });
  }
}

// Create singleton instance
export const errorCollector = ErrorCollector.getInstance();
