
interface ErrorDetails {
  [key: string]: any;
}

export interface ErrorData {
  message: string;
  source: 'client' | 'server' | 'network';
  stack?: string;
  details?: ErrorDetails;
  timestamp?: string;
  component?: string; // Added component field
  url?: string;
  browserInfo?: {
    userAgent?: string;
    language?: string;
    platform?: string;
    [key: string]: any;
  };
}

class ErrorCollector {
  private errors: ErrorData[] = [];
  private readonly maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  addError(error: ErrorData | Error): string {
    // Convert standard Error to ErrorData if needed
    const errorData: ErrorData = this.convertToErrorData(error);
    
    // Add timestamp to the error
    errorData.timestamp = new Date().toISOString();

    // If the collector is full, remove the oldest error
    if (this.errors.length >= this.maxSize) {
      this.errors.shift();
    }

    this.errors.push(errorData);
    console.warn('Error collected:', errorData); // Log the error for immediate visibility
    
    // Generate and return an error code (simple implementation)
    const errorCode = `ERR-${Date.now().toString(36)}`;
    return errorCode;
  }

  // Helper method to convert Error to ErrorData
  private convertToErrorData(error: Error | ErrorData): ErrorData {
    if ('source' in error) {
      return error as ErrorData;
    }
    
    // If it's a standard Error object, convert it
    return {
      message: error.message || 'Unknown error',
      source: 'client', // Default source
      stack: error.stack,
    };
  }

  // Method to log and notify about an error
  logErrorAndNotify(error: Error, component?: string): void {
    this.addError({
      message: error.message,
      source: 'client',
      stack: error.stack,
      component,
      timestamp: new Date().toISOString()
    });
  }

  getErrors(): ErrorData[] {
    return this.errors;
  }

  clearErrors(): void {
    this.errors = [];
  }

  // Method to report all collected errors (e.g., send to server)
  reportErrors(): Promise<void> {
    return new Promise<void>((resolve) => {
      console.log('Reporting errors:', this.errors);
      // In a real implementation, this would send errors to a server
      // For now, we'll just resolve the promise
      setTimeout(resolve, 500);
    });
  }

  // Method to filter errors by source
  filterErrorsBySource(source: 'client' | 'server' | 'network'): ErrorData[] {
    return this.errors.filter(error => error.source === source);
  }

  // Method to search errors by message
  searchErrorsByMessage(message: string): ErrorData[] {
    const searchTerm = message.toLowerCase();
    return this.errors.filter(error =>
      error.message.toLowerCase().includes(searchTerm)
    );
  }
}

const errorCollector = new ErrorCollector();

export { errorCollector, ErrorCollector };
