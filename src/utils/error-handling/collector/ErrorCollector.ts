import { ErrorData, ErrorOptions, ErrorCollector } from './types';

class ErrorCollectorImplementation implements ErrorCollector {
  private errors: ErrorData[] = [];
  
  captureError(error: Error | string, options?: ErrorOptions): string {
    const errorId = `error-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    // Extract error details
    const errorData: ErrorData = {
      id: errorId,
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      component: options?.component || 'unknown',
      source: options?.source || 'client',
      details: options?.details,
      severity: options?.severity || 'medium',
      timestamp: Date.now()
    };
    
    // Store error in memory
    this.errors.unshift(errorData);
    
    // Keep only the last 50 errors
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(0, 50);
    }
    
    // Log to console for development
    console.error('[ErrorCollector]', errorData);
    
    // In production, we would send this to a logging service
    // or to a Supabase table via an API endpoint
    try {
      // Here we could send to Supabase or other error tracking service
      // This is intentionally commented out as implementation depends on
      // project setup - we don't want to cause more errors
    } catch (loggingError) {
      console.error('Error while logging error:', loggingError);
    }
    
    return errorId;
  }
  
  getErrors(): ErrorData[] {
    return [...this.errors];
  }
  
  clearErrors(): void {
    this.errors = [];
  }
}

// Singleton instance
export const errorCollector: ErrorCollector = new ErrorCollectorImplementation();
