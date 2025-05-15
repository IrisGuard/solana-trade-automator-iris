
import { ErrorData, ErrorCollector, ErrorOptions } from './types';

export class ErrorCollectorImpl implements ErrorCollector {
  private errors = new Map<string, ErrorData>();
  private listeners: ((error: ErrorData) => void)[] = [];

  captureError(error: Error, options: ErrorOptions = {}): string {
    // Generate a new ID for the error
    const errorId = crypto.randomUUID();
    
    const errorData: ErrorData = {
      id: errorId,
      message: error.message,
      stack: error.stack,
      component: options.component || 'unknown',
      source: options.source || 'client',
      details: options.details,
      timestamp: Date.now(),
      severity: options.severity || 'medium',
      status: options.status,
      errorType: options.errorType,
      handled: false,
      autoFixed: false
    };
    
    this.errors.set(errorId, errorData);
    
    // Notify listeners
    this.listeners.forEach(listener => listener(errorData));
    
    return errorId;
  }
  
  getErrors(): ErrorData[] {
    return Array.from(this.errors.values());
  }
  
  clearErrors(): void {
    this.errors.clear();
  }
  
  getError(id: string): ErrorData | undefined {
    return this.errors.get(id);
  }
  
  removeError(id: string): void {
    this.errors.delete(id);
  }
  
  updateError(id: string, updates: Partial<ErrorData>): void {
    const error = this.errors.get(id);
    if (error) {
      this.errors.set(id, { ...error, ...updates });
    }
  }
  
  onErrorCaptured(callback: (error: ErrorData) => void): () => void {
    this.listeners.push(callback);
    
    // Return function to unsubscribe
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
}

export const errorCollector: ErrorCollector = new ErrorCollectorImpl();
