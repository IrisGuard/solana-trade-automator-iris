
import { supabase } from '@/integrations/supabase/client';
import type { ErrorData, ErrorOptions } from './types';
import { v4 as uuidv4 } from 'uuid';

class ErrorCollector {
  private static instance: ErrorCollector;
  private isEnabled: boolean = true;
  private errors: ErrorData[] = [];
  private errorCallbacks: ((error: ErrorData) => void)[] = [];
  
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
  
  public captureError(error: Error, options: ErrorOptions = {}): string {
    if (!this.isEnabled) {
      console.log('Error collection disabled:', error.message);
      return '';
    }
    
    const errorId = options.errorType ? `${options.errorType}-${uuidv4()}` : uuidv4();
    
    const errorData: ErrorData = {
      id: errorId,
      name: error.name,
      message: error.message,
      stack: error.stack,
      component: options.component || 'unknown',
      source: options.source || 'client',
      details: options.details || {},
      severity: options.severity || 'medium',
      timestamp: Date.now(),
      browser: this.getBrowserInfo()
    };
    
    // Store locally
    this.errors.unshift(errorData);
    
    // Trim the errors array if it's too large
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(0, 100);
    }
    
    // Notify callbacks
    this.errorCallbacks.forEach(callback => {
      try {
        callback(errorData);
      } catch (e) {
        console.error('Error in error callback:', e);
      }
    });
    
    // Try to send to Supabase
    this.collectError(errorData, options).catch(e => {
      console.error('Failed to send error to Supabase:', e);
    });
    
    return errorId;
  }
  
  public getErrors(): ErrorData[] {
    return [...this.errors];
  }
  
  public clearErrors(): void {
    this.errors = [];
  }
  
  public getError(id: string): ErrorData | undefined {
    return this.errors.find(e => e.id === id);
  }
  
  public removeError(id: string): void {
    this.errors = this.errors.filter(e => e.id !== id);
  }
  
  public updateError(id: string, updates: Partial<ErrorData>): void {
    const index = this.errors.findIndex(e => e.id === id);
    if (index >= 0) {
      this.errors[index] = { ...this.errors[index], ...updates };
    }
  }
  
  public onErrorCaptured(callback: (error: ErrorData) => void): () => void {
    this.errorCallbacks.push(callback);
    
    // Return function to remove the callback
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter(cb => cb !== callback);
    };
  }
  
  public async collectError(errorData: ErrorData, options: ErrorOptions = {}): Promise<string | null> {
    if (!this.isEnabled) {
      console.log('Error collection disabled:', errorData.message);
      return null;
    }
    
    try {
      const errorId = errorData.id || options.errorId || uuidv4();
      
      // Use Supabase function to log error
      const { data, error } = await supabase.rpc('log_error', {
        p_error_message: errorData.message,
        p_error_stack: errorData.stack || null,
        p_component: errorData.component || null,
        p_source: errorData.source || 'client',
        p_url: errorData.url || window.location.href,
        p_browser_info: errorData.browser || this.getBrowserInfo()
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
