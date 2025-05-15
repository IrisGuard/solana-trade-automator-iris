
import { ErrorData, ErrorOptions, ErrorCollector } from './types';

class ErrorCollectorImplementation implements ErrorCollector {
  captureError(error: Error, options?: ErrorOptions): void {
    // Extract error details
    const errorData: ErrorData = {
      message: error.message,
      stack: error.stack,
      component: options?.component || 'unknown',
      source: options?.source || 'client',
      details: options?.details,
      severity: options?.severity || 'medium'
    };
    
    // Log to console for development
    console.error('[ErrorCollector]', errorData);
    
    // In production, we would send this to a logging service
    // or to a Supabase table via an API endpoint
    try {
      // Here we could send to Supabase or other error tracking service
      // This is intentionally commented out as implementation depends on
      // project setup - we don't want to cause more errors
      /*
      supabase.rpc('log_error', {
        p_error_message: errorData.message,
        p_error_stack: errorData.stack,
        p_component: errorData.component,
        p_source: errorData.source,
        p_url: window.location.href,
        p_browser_info: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          details: errorData.details
        }
      }).then(({ error }) => {
        if (error) console.error('Failed to log error to Supabase:', error);
      });
      */
    } catch (loggingError) {
      console.error('Error while logging error:', loggingError);
    }
  }
}

// Singleton instance
export const errorCollector: ErrorCollector = new ErrorCollectorImplementation();
