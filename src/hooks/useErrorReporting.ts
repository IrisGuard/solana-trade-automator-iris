
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ErrorReportingOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  saveToDatabase?: boolean;
}

export function useErrorReporting() {
  const defaultOptions: ErrorReportingOptions = {
    showToast: true,
    logToConsole: true,
    saveToDatabase: true,
  };

  const reportError = async (error: Error | string, options: ErrorReportingOptions = defaultOptions) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error !== 'string' ? error.stack : undefined;
    
    // Εμφάνιση toast μηνύματος
    if (options.showToast) {
      toast.error(`Σφάλμα: ${errorMessage}`, {
        description: "Το σφάλμα καταγράφηκε αυτόματα.",
        duration: 5000,
      });
    }
    
    // Καταγραφή στην κονσόλα
    if (options.logToConsole) {
      console.error("Αυτόματη αναφορά σφάλματος:", {
        message: errorMessage,
        stack: errorStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      });
    }
    
    // Αποθήκευση στη βάση δεδομένων
    if (options.saveToDatabase) {
      try {
        const browserInfo = {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          screenSize: {
            width: window.screen.width,
            height: window.screen.height,
          }
        };

        await supabase.rpc('log_error', {
          p_error_message: errorMessage,
          p_error_stack: errorStack,
          p_component: typeof error !== 'string' && error.stack 
            ? error.stack.split('\n')[1]?.trim() 
            : undefined,
          p_source: 'client',
          p_url: window.location.href,
          p_browser_info: browserInfo
        });
      } catch (dbError) {
        console.error("Σφάλμα κατά την αποθήκευση του σφάλματος στη βάση:", dbError);
      }
    }
  };
  
  return { reportError };
}
