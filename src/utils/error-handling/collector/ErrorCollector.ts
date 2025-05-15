
import { supabase } from '@/integrations/supabase/client';
import type { ErrorData, ErrorOptions } from './types';
import { v4 as uuidv4 } from 'uuid';

class ErrorCollector {
  private static instance: ErrorCollector;
  private isEnabled: boolean = true;
  
  private constructor() {
    // Singleton pattern
  }
  
  public static getInstance(): ErrorCollector {
    if (!ErrorCollector.instance) {
      ErrorCollector.instance = new ErrorCollector();
    }
    return ErrorCollector.instance;
  }
  
  public enable(): void {
    this.isEnabled = true;
  }
  
  public disable(): void {
    this.isEnabled = false;
  }
  
  public async collectError(errorData: ErrorData, options: ErrorOptions = {}): Promise<string | null> {
    if (!this.isEnabled) {
      console.log('Error collection disabled:', errorData.message);
      return null;
    }
    
    try {
      const errorId = options.errorId || uuidv4();
      
      // Use Supabase function to log error
      const { data, error } = await supabase.rpc('log_error', {
        p_error_message: errorData.message,
        p_error_stack: errorData.stack || null,
        p_component: errorData.component || null,
        p_source: errorData.source || 'client',
        p_url: errorData.url || window.location.href,
        p_browser_info: errorData.browserInfo || this.getBrowserInfo()
      });
      
      if (error) {
        console.error('Failed to log error to Supabase:', error);
        return null;
      }
      
      return data as string;
    } catch (e) {
      console.error('Error in error collection process:', e);
      return null;
    }
  }
  
  private getBrowserInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      timestamp: new Date().toISOString()
    };
  }
}

export const errorCollector = ErrorCollector.getInstance();
