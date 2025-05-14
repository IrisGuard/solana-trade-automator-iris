import { supabase } from '@/integrations/supabase/client';

export interface ErrorData {
  id?: string;
  message: string;
  stack?: string;
  component?: string;
  details?: string | Record<string, any>;
  source?: string;
  url?: string;
  browserInfo?: Record<string, any>;
  timestamp: number;
}

class ErrorCollector {
  private readonly MAX_QUEUE_SIZE = 10;
  private errorQueue: Array<{error: Error, data?: ErrorData}> = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private readonly FLUSH_INTERVAL = 10000; // 10 seconds
  private storedErrors: ErrorData[] = [];
  
  constructor() {
    window.addEventListener('unload', () => this.flush(true));
  }
  
  public captureError(error: Error, data?: Omit<ErrorData, 'message' | 'timestamp'>): void {
    console.error('Error captured:', error, data);
    
    const errorData: ErrorData = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      timestamp: Date.now(),
      ...(data || {})
    };

    // Store error in memory for retrieval
    this.storedErrors.push(errorData);
    
    // Keep only recent errors (max 50)
    if (this.storedErrors.length > 50) {
      this.storedErrors.shift();
    }
    
    this.errorQueue.push({ error, data: errorData });
    
    if (this.errorQueue.length >= this.MAX_QUEUE_SIZE) {
      this.flush(true);
    } else if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flush(), this.FLUSH_INTERVAL);
    }
  }
  
  public reportError(error: Error, component?: string, details?: any): void {
    this.captureError(error, { component, details });
  }
  
  public getAllErrors(): ErrorData[] {
    return this.storedErrors;
  }
  
  public clearAllErrors(): void {
    this.storedErrors = [];
    this.errorQueue = [];
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    console.log("All errors cleared");
  }
  
  private async flush(immediate = false): Promise<void> {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    
    if (this.errorQueue.length === 0) return;
    
    const errors = [...this.errorQueue];
    this.errorQueue = [];
    
    try {
      await Promise.all(errors.map(({ error, data }) => this.logErrorToSupabase(error, data)));
    } catch (flushError) {
      console.error('Error flushing error queue:', flushError);
      
      // If flushing fails and it wasn't an immediate flush, add back to queue
      if (!immediate) {
        this.errorQueue = [...errors, ...this.errorQueue]; 
      }
    }
  }
  
  private async logErrorToSupabase(error: Error, data?: ErrorData): Promise<void> {
    try {
      const errorMessage = error.message || 'Unknown error';
      const errorStack = error.stack;
      const component = data?.component || 'unknown';
      const source = data?.source || 'client';
      const url = data?.url || window.location.href;
      const browserInfo = data?.browserInfo || this.getBrowserInfo();
      
      const { error: supabaseError } = await supabase.rpc('log_error', {
        p_error_message: errorMessage,
        p_error_stack: errorStack,
        p_component: component,
        p_source: source,
        p_url: url,
        p_browser_info: browserInfo
      });
      
      if (supabaseError) {
        console.error('Error logging to Supabase:', supabaseError);
      }
    } catch (e) {
      console.error('Error storing error in Supabase:', e);
    }
  }
  
  private getBrowserInfo(): Record<string, any> {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      timestamp: new Date().toISOString()
    };
  }
}

// Singleton instance
export const errorCollector = new ErrorCollector();
