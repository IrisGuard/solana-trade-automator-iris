
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';

export function useErrorReporting() {
  const [isReporting, setIsReporting] = useState(false);

  /**
   * Report an error to the backend
   */
  const reportError = useCallback(async (error: Error | string, component?: string, details?: any) => {
    setIsReporting(true);
    
    try {
      const errorMessage = typeof error === 'string' ? error : error.message;
      const errorStack = typeof error === 'string' ? '' : error.stack || '';
      
      // Add to error collector first
      errorCollector.captureError(error, {
        component,
        details,
        source: 'client'
      });
      
      // Report to Supabase if available
      if (supabase) {
        const { error: supabaseError } = await supabase.rpc('log_error', {
          p_error_message: errorMessage,
          p_error_stack: errorStack,
          p_component: component || 'unknown',
          p_source: 'client',
          p_browser_info: details ? JSON.stringify(details) : null
        });
        
        if (supabaseError) {
          console.error('Failed to report error to backend:', supabaseError);
          toast.error('Failed to report error to server');
          return false;
        }
        
        toast.success('Error reported successfully');
        return true;
      }
      
      return false;
    } catch (reportingError) {
      console.error('Error during error reporting:', reportingError);
      toast.error('Failed to report error');
      return false;
    } finally {
      setIsReporting(false);
    }
  }, []);
  
  return {
    reportError,
    isReporting
  };
}
