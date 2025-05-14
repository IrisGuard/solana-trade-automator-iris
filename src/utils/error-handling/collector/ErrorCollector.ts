
import { supabase } from '@/integrations/supabase/client';

export interface ErrorData {
  component?: string;
  details?: string;
  source?: string;
  url?: string;
  browserInfo?: Record<string, any>;
}

class ErrorCollector {
  private readonly MAX_QUEUE_SIZE = 10;
  private errorQueue: Array<{error: Error, data?: ErrorData}> = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private readonly FLUSH_INTERVAL = 10000; // 10 seconds
  
  constructor() {
    window.addEventListener('unload', () => this.flush(true));
  }
  
  public captureError(error: Error, data?: ErrorData): void {
    console.error('Error captured:', error, data);
    
    this.errorQueue.push({ error, data });
    
    if (this.errorQueue.length >= this.MAX_QUEUE_SIZE) {
      this.flush(true);
    } else if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flush(), this.FLUSH_INTERVAL);
    }
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
