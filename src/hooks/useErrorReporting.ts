
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';
import { sendErrorToChat as sendToChat } from '@/utils/error-handling/displayError';

export function useErrorReporting() {
  const [isReporting, setIsReporting] = useState(false);

  /**
   * Report an error to the backend
   */
  const reportError = useCallback(async (error: Error | string, componentOrOptions?: string | any, details?: any) => {
    setIsReporting(true);
    
    try {
      // Check if the second parameter is a string (component) or options object
      const isOptionsObject = typeof componentOrOptions === 'object' && componentOrOptions !== null;
      
      const component = isOptionsObject ? componentOrOptions.component : componentOrOptions;
      const options = isOptionsObject ? componentOrOptions : {};
      const errorDetails = isOptionsObject ? options.details : details;
      
      const errorMessage = typeof error === 'string' ? error : error.message;
      const errorStack = typeof error === 'string' ? '' : error.stack || '';
      
      // Add to error collector first
      errorCollector.captureError(error, {
        component,
        details: errorDetails,
        source: 'client'
      });
      
      // Show toast if requested
      if (options.showToast) {
        toast.error(errorMessage);
      }
      
      // Send to chat if requested
      if (options.sendToChatInterface) {
        sendToChat(error, { component, ...errorDetails });
      }
      
      // Report to Supabase if available
      if (supabase) {
        const { error: supabaseError } = await supabase.rpc('log_error', {
          p_error_message: errorMessage,
          p_error_stack: errorStack,
          p_component: component || 'unknown',
          p_source: 'client',
          p_browser_info: errorDetails ? JSON.stringify(errorDetails) : null
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
  
  /**
   * Send error to chat interface
   */
  const sendErrorToChat = useCallback((message: string, stack?: string) => {
    sendToChat(message, { stack });
    toast.success('Error sent to chat for analysis');
  }, []);
  
  return {
    reportError,
    sendErrorToChat,
    isReporting
  };
}
