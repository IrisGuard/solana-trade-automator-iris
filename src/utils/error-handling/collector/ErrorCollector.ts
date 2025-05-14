
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { 
  ErrorCollector as IErrorCollector,
  ErrorData, 
  ErrorOptions, 
  ErrorSource 
} from './types';

/**
 * Error collector implementation that captures and logs errors
 */
class ErrorCollectorImpl implements IErrorCollector {
  private errors: ErrorData[] = [];
  private readonly maxErrors = 50;
  
  /**
   * Capture an error with additional context
   */
  captureError(error: Error | unknown, options: ErrorOptions = {}): string {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    // Generate unique ID for this error
    const errorId = uuidv4();
    
    // Create error data object
    const errorData: ErrorData = {
      id: errorId,
      message: errorObj.message,
      stack: errorObj.stack,
      component: options.component,
      source: options.source || 'client',
      url: options.url || (typeof window !== 'undefined' ? window.location.href : undefined),
      browserInfo: options.browserInfo || this.getBrowserInfo(),
      timestamp: new Date()
    };
    
    // Add to in-memory collection (with limit)
    this.errors.unshift(errorData);
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }
    
    // Log the error to console
    console.error('[ERROR]:', errorData.message, errorData);
    
    // Log to backend if available
    this.logError(errorData).catch((logError) => {
      console.error('Failed to log error to backend:', logError);
    });
    
    return errorId;
  }
  
  /**
   * Get all captured errors
   */
  getErrors(): ErrorData[] {
    return [...this.errors];
  }
  
  /**
   * Clear all captured errors
   */
  clearErrors(): void {
    this.errors = [];
  }
  
  /**
   * Log the error to the backend
   */
  async logError(errorData: ErrorData): Promise<string | null> {
    try {
      // Use Supabase to log the error
      const { data, error } = await supabase.rpc('log_error', {
        p_error_message: errorData.message,
        p_error_stack: errorData.stack || null,
        p_component: errorData.component || null,
        p_source: errorData.source || 'client',
        p_url: errorData.url || null,
        p_browser_info: errorData.browserInfo || null
      });
      
      if (error) {
        console.error('Failed to log error to Supabase:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Exception logging error to backend:', error);
      return null;
    }
  }
  
  /**
   * Get browser and environment information
   */
  private getBrowserInfo(): Record<string, any> {
    if (typeof window === 'undefined') {
      return { environment: 'server' };
    }
    
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      timestamp: new Date().toISOString()
    };
  }

  // For backward compatibility
  addError(error: Error | unknown, options: ErrorOptions = {}): string {
    return this.captureError(error, options);
  }

  getAllErrors(): ErrorData[] {
    return this.getErrors();
  }

  clearAllErrors(): void {
    this.clearErrors();
  }
}

// Create singleton instance
export const errorCollector = new ErrorCollectorImpl();
export type { ErrorData, ErrorOptions };
