
import { ErrorData, ErrorOptions } from './types';

/**
 * ErrorCollector Class
 * Responsible for collecting, storing, and retrieving errors that occur in the application.
 */
export class ErrorCollector {
  private errors: ErrorData[] = [];
  private maxErrors: number = 100;
  private errorCount: number = 0;

  /**
   * Capture an error with additional context
   */
  public captureError(error: Error | string, options: ErrorOptions = {}): string {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const errorMessage = errorObj.message;
    const errorStack = errorObj.stack;
    
    const errorId = this.generateErrorId();
    
    const errorData: ErrorData = {
      id: errorId,
      error: errorObj,
      message: errorMessage,
      stack: errorStack || null,
      timestamp: new Date().toISOString(),
      component: options.component || null,
      source: options.source || 'client',
      url: window.location.href,
      browserInfo: this.getBrowserInfo(),
      errorCode: options.errorCode || null,
      context: options.context || null,
      metadata: options.metadata || null,
      status: options.status || null,
      errorId: options.errorId || null,
      errorType: options.errorType,
      details: options.details,
      severity: options.severity || 'medium',
      options: options
    };

    this.addError(errorData);
    this.errorCount++;
    
    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[ErrorCollector] ${errorData.message}`, errorData);
    }

    // Call the onError callback if provided
    if (options.onError) {
      try {
        options.onError(errorData);
      } catch (callbackError) {
        console.error('[ErrorCollector] Error in onError callback:', callbackError);
      }
    }

    return errorId;
  }

  /**
   * Add an error to the collection
   */
  private addError(errorData: ErrorData): void {
    // Add to beginning of array for chronological ordering
    this.errors.unshift(errorData);
    
    // Limit the number of stored errors
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }

    // Report to monitoring system if configured
    this.reportError(errorData);
  }

  /**
   * Get all captured errors
   */
  public getErrors(): ErrorData[] {
    return this.errors;
  }

  /**
   * Clear all errors
   */
  public clearErrors(): void {
    this.errors = [];
  }

  /**
   * Get browser and system information
   */
  private getBrowserInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate a unique error ID
   */
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  /**
   * Report error to remote services if configured
   */
  private reportError(errorData: ErrorData): void {
    // Implementation left empty for now - would connect to backend service
  }

  /**
   * Returns the total number of errors captured
   */
  public getErrorCount(): number {
    return this.errorCount;
  }
}

// Export a singleton instance for global use
export const errorCollector = new ErrorCollector();
