
import { useCallback } from 'react';
import { errorCollector } from '@/utils/error-handling/collector';
import { displayError } from '@/utils/error-handling/displayError';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ErrorReportingOptions {
  component?: string;
  source?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  details?: any;
  showUI?: boolean;
  showToast?: boolean;
  toastTitle?: string;
  toastDescription?: string;
  persist?: boolean;
}

/**
 * Hook for reporting errors with consistent formatting and tracking
 * @returns Object with methods for error reporting and management
 */
export function useErrorReporting() {
  /**
   * Report an error with various options for display and persistence
   */
  const reportError = useCallback(async (error: Error, options: ErrorReportingOptions = {}) => {
    // Log to console
    console.error(`[Error Reporting] Error in ${options.component || 'unknown'}: ${error.message}`, error);
    
    // Add default options
    const mergedOptions = {
      component: 'unknown',
      source: 'client',
      severity: 'medium' as const,
      persist: options.severity === 'high' || options.severity === 'critical',
      ...options
    };
    
    // Add to error collector - ensure this returns a string
    const errorId = errorCollector.captureError(error, mergedOptions);
    
    // Display error UI if needed
    if (options.showUI) {
      displayError(error, {
        showToast: true,
        toastTitle: options.toastTitle || "Σφάλμα",
        ...options
      });
    } else if (options.showToast) {
      toast.error(options.toastTitle || 'Σφάλμα', {
        description: options.toastDescription || error.message,
        id: errorId
      });
    }
    
    // Add additional diagnostic information when it's a critical error
    if (mergedOptions.persist) {
      try {
        // Gather more detailed system information
        const diagnosticInfo = {
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          viewportSize: `${window.innerWidth}x${window.innerHeight}`,
          memoryUsage: 'Not available', // Default value
          component: options.component,
          source: options.source
        };
        
        // Try to get memory info if available in the browser
        // Check if performance.memory exists before trying to access it
        if (performance && 'memory' in performance) {
          try {
            // Use type assertion to access memory property
            const memoryInfo = (performance as any).memory;
            if (memoryInfo) {
              diagnosticInfo.memoryUsage = JSON.stringify(memoryInfo);
            }
          } catch (memErr) {
            console.warn("Could not access memory information:", memErr);
          }
        }
        
        console.warn("[Error Diagnostics] Additional information:", diagnosticInfo);
        
        // Store in Supabase if user is authenticated
        if (supabase && mergedOptions.persist) {
          try {
            const { data: session } = await supabase.auth.getSession();
            const { error: dbError } = await supabase
              .from('error_logs')
              .insert({
                error_message: error.message,
                error_stack: error.stack,
                component: options.component,
                source: options.source,
                user_id: session?.session?.user?.id,
                url: window.location.href,
                browser_info: diagnosticInfo
              });
              
            if (dbError) {
              console.warn("Error persisting to database:", dbError);
            }
          } catch (dbErr) {
            console.warn("Failed to persist error to database:", dbErr);
          }
        }
        
        // Log to localStorage for recovery purposes
        try {
          const storedErrors = JSON.parse(localStorage.getItem('app_critical_errors') || '[]');
          storedErrors.push({
            message: error.message,
            stack: error.stack,
            diagnosticInfo,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('app_critical_errors', JSON.stringify(storedErrors.slice(-20))); // Keep last 20 errors
        } catch (e) {
          console.error("Failed to store error in localStorage:", e);
        }
      } catch (e) {
        console.error("Error in diagnostic information collection:", e);
      }
    }
    
    return errorId;
  }, []);

  /**
   * Clear error cache from local storage
   */
  const clearErrorCache = useCallback(() => {
    try {
      localStorage.removeItem('app_errors');
      localStorage.removeItem('app_critical_errors');
      console.log("[Error Reporting] Error cache cleared");
      return true;
    } catch (e) {
      console.error("[Error Reporting] Failed to clear error cache:", e);
      return false;
    }
  }, []);
  
  /**
   * Get stored errors from localStorage
   */
  const getStoredErrors = useCallback(() => {
    try {
      const criticalErrors = JSON.parse(localStorage.getItem('app_critical_errors') || '[]');
      const regularErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      return {
        critical: criticalErrors,
        regular: regularErrors
      };
    } catch (e) {
      console.error("[Error Reporting] Failed to retrieve stored errors:", e);
      return { critical: [], regular: [] };
    }
  }, []);
  
  return { reportError, clearErrorCache, getStoredErrors };
}
