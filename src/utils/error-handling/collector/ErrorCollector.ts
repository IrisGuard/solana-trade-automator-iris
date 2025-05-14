
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

    return errorData.message;
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
}

const errorCollector = new ErrorCollector();

export { errorCollector, type ErrorData };
