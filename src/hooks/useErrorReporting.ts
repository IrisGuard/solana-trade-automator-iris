
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ErrorReportingOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  saveToDatabase?: boolean;
  sendToChatInterface?: boolean;
}

export function useErrorReporting() {
  const defaultOptions: ErrorReportingOptions = {
    showToast: true,
    logToConsole: true,
    saveToDatabase: true,
    sendToChatInterface: true
  };

  const reportError = async (error: Error | string, options: ErrorReportingOptions = defaultOptions) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error !== 'string' ? error.stack : undefined;
    
    // Εμφάνιση toast μηνύματος
    if (options.showToast) {
      toast.error(`Σφάλμα: ${errorMessage}`, {
        description: "Το σφάλμα καταγράφηκε αυτόματα.",
        duration: 5000,
        action: {
          label: "Αποστολή στο chat",
          onClick: () => sendErrorToChat(errorMessage, errorStack)
        }
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
    
    // Αποστολή στο chat interface
    if (options.sendToChatInterface) {
      sendErrorToChat(errorMessage, errorStack);
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
  
  // Νέα συνάρτηση για αποστολή σφάλματος στο chat
  const sendErrorToChat = (errorMessage: string, errorStack?: string) => {
    try {
      // Δημιουργία μηνύματος για το chat
      const chatMessage = {
        type: 'error',
        message: errorMessage,
        stack: errorStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      };
      
      // Αποθήκευση στο localStorage για εύκολη πρόσβαση
      const storedErrors = JSON.parse(localStorage.getItem('lovable_chat_errors') || '[]');
      storedErrors.push(chatMessage);
      localStorage.setItem('lovable_chat_errors', JSON.stringify(storedErrors));
      
      // Αποστολή event για να ενημερώσει το chat interface
      const event = new CustomEvent('lovable-error', { 
        detail: chatMessage
      });
      window.dispatchEvent(event);
      
      // Δημιουργία παραθύρου διαλόγου στο chat
      if (window.lovableChat && typeof window.lovableChat.createErrorDialog === 'function') {
        window.lovableChat.createErrorDialog(chatMessage);
      }
    } catch (e) {
      console.error("Σφάλμα κατά την αποστολή του σφάλματος στο chat interface:", e);
    }
  };
  
  return { reportError, sendErrorToChat };
}
