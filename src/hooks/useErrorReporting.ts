
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
      console.log("Αυτόματη αναφορά σφάλματος:", {
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
  
  // Συνάρτηση για αποστολή σφάλματος στο chat
  const sendErrorToChat = (errorMessage: string, errorStack?: string) => {
    try {
      // Καθαρισμός προηγούμενων σφαλμάτων
      if (window.lovableChat && typeof window.lovableChat.clearErrors === 'function') {
        window.lovableChat.clearErrors();
      }
      
      // Αποστολή event για καθαρισμό σφαλμάτων
      const clearEvent = new CustomEvent('lovable-clear-errors');
      window.dispatchEvent(clearEvent);
      
      // Περιμένουμε λίγο για να καθαρίσουν τα προηγούμενα σφάλματα
      setTimeout(() => {
        // Δημιουργία μηνύματος για το chat
        const chatMessage = {
          type: 'error',
          message: errorMessage,
          stack: errorStack,
          timestamp: new Date().toISOString(),
          url: window.location.href,
        };
        
        // Δημιουργία παραθύρου διαλόγου στο chat
        if (window.lovableChat && typeof window.lovableChat.createErrorDialog === 'function') {
          window.lovableChat.createErrorDialog(chatMessage);
        } else {
          // Εναλλακτική μέθοδος με χρήση event
          const event = new CustomEvent('lovable-error', { 
            detail: chatMessage
          });
          window.dispatchEvent(event);
        }
        
        // Αντιγραφή στο πρόχειρο
        try {
          const clipboardText = `Παρακαλώ διορθώστε το παρακάτω σφάλμα:\n\nΜήνυμα: ${errorMessage}\n\n${errorStack ? `Stack Trace: ${errorStack}\n\n` : ''}Χρονοσήμανση: ${new Date().toISOString()}\nURL: ${window.location.href}`;
          navigator.clipboard.writeText(clipboardText).catch(() => {
            // Σιωπηλή αποτυχία αν δεν υποστηρίζεται το API clipboard
          });
        } catch (e) {
          // Σιωπηλή αποτυχία για προβλήματα με το clipboard
        }
      }, 200);
    } catch (e) {
      console.error("Σφάλμα κατά την αποστολή του σφάλματος στο chat interface:", e);
    }
  };
  
  return { reportError, sendErrorToChat };
}
