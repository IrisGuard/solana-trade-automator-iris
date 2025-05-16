
// Define interfaces for error data
export interface ErrorData {
  component?: string;
  method?: string;
  additional?: string;
  source?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  details?: Record<string, unknown>;
}

/**
 * Error collector utility for gathering error information
 * before sending to storage or logging services
 */
class ErrorCollector {
  private errors: Array<{
    error: Error;
    data: ErrorData;
    timestamp: number;
    id: string;
  }> = [];
  
  private maxBufferSize = 10;
  
  /**
   * Capture an error with associated metadata
   */
  public captureError(error: Error | unknown, data: ErrorData = {}): string {
    const timestamp = Date.now();
    const errorObject = error instanceof Error ? error : new Error(String(error));
    const errorId = `err_${timestamp}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Add to the buffer
    this.errors.push({
      error: errorObject,
      data,
      timestamp,
      id: errorId
    });
    
    // Keep buffer size in check
    if (this.errors.length > this.maxBufferSize) {
      this.errors.shift();
    }
    
    // Log to console in development
    console.error(`[ErrorCollector] ${data.component || 'Unknown'}:`, errorObject);
    
    // Send to server if possible
    this.sendToServer(errorObject, data, errorId);
    
    return errorId;
  }
  
  /**
   * Same as captureError but for compatibility with older code
   */
  public collectError(error: Error | unknown, data: ErrorData = {}): string {
    return this.captureError(error, data);
  }
  
  /**
   * Get recent errors - modified to return ErrorData compatible with the collector/types.ts interface
   */
  public getRecentErrors(limit: number = 10) {
    return this.getErrors().slice(0, limit);
  }
  
  /**
   * Get all errors - adding this method to fix the compatibility issue
   */
  public getErrors() {
    return this.errors.map(e => ({
      id: e.id,
      error: e.error,
      timestamp: new Date(e.timestamp).toISOString(),
      message: e.error.message,
      stack: e.error.stack,
      component: e.data.component || null,
      source: e.data.source || 'client',
      url: typeof window !== 'undefined' ? window.location.href : null,
      browserInfo: typeof navigator !== 'undefined' ? { 
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform
      } : null,
      errorCode: null,
      context: null,
      metadata: null,
      status: null,
      errorId: null,
      errorType: e.data.method,
      details: e.data.details,
      severity: e.data.severity || 'medium',
      options: e.data
    }));
  }
  
  /**
   * Clear error buffer
   */
  public clearErrors() {
    this.errors = [];
  }
  
  /**
   * Send error to server for logging
   */
  private async sendToServer(error: Error, data: ErrorData, errorId: string) {
    try {
      // Attempt to log to Supabase if available
      const { supabase } = await import('@/integrations/supabase/client');
      
      if (!supabase) return;
      
      // Call the log_error function
      const { error: logError } = await supabase.rpc('log_error', {
        p_error_message: error.message,
        p_error_stack: error.stack,
        p_component: data.component || null,
        p_source: data.source || 'client',
        p_url: typeof window !== 'undefined' ? window.location.href : null,
        p_browser_info: typeof navigator !== 'undefined' ? { 
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform
        } : null
      });
      
      if (logError) {
        console.error('Error logging to server:', logError);
      }
    } catch (e) {
      // Silent fail if server logging fails
      console.warn('Failed to log error to server:', e);
    }
  }
  
  /**
   * Get error count
   */
  public getErrorCount(): number {
    return this.errors.length;
  }
}

// Export a singleton instance
export const errorCollector = new ErrorCollector();
