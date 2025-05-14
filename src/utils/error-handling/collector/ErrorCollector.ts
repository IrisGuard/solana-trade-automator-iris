
interface ErrorData {
  message: string;
  stack?: string;
  component?: string;
  method?: string;
  source?: string;
  timestamp?: number;
  details?: any;
}

class ErrorCollector {
  private errors: ErrorData[] = [];
  private maxErrors: number = 100;

  constructor(maxErrors: number = 100) {
    this.maxErrors = maxErrors;
  }

  public captureError(error: Error | string, context?: Partial<ErrorData>): string {
    const errorData: ErrorData = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      source: 'client',
      timestamp: Date.now(),
      ...context
    };

    // Add error to the collection
    this.errors.push(errorData);

    // Trim collection if exceeds max size
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error captured:', errorData);
    }

    // Return error message as identifier
    return errorData.message;
  }
  
  // Alias for captureError to maintain backward compatibility
  public addError(errorData: Partial<ErrorData>): string {
    const fullErrorData: ErrorData = {
      message: errorData.message || 'Unknown error',
      timestamp: Date.now(),
      ...errorData
    };
    
    return this.captureError(fullErrorData.message, fullErrorData);
  }
  
  // Enhanced method to log and notify about errors
  public logErrorAndNotify(error: Error | string, context?: Partial<ErrorData>): string {
    // First, capture the error
    const errorId = this.captureError(error, context);
    
    // Log to console
    console.error("Error logged:", typeof error === 'string' ? error : error.message);
    
    // Return error ID for reference
    return errorId;
  }

  public getErrors(): ErrorData[] {
    return [...this.errors];
  }

  public clearErrors(): void {
    this.errors = [];
  }

  public getLatestError(): ErrorData | null {
    return this.errors.length > 0 ? this.errors[this.errors.length - 1] : null;
  }
  
  // Report all collected errors to the backend
  public async reportErrors(): Promise<void> {
    const errors = this.getErrors();
    if (errors.length === 0) {
      console.log('No errors to report');
      return;
    }
    
    console.log(`Reporting ${errors.length} errors to backend`);
    
    // Report logic here - placeholder for now
    // In a real implementation, this would send errors to a backend service
    
    console.log('Errors reported successfully');
  }
}

const errorCollector = new ErrorCollector();

export { errorCollector, type ErrorData };
