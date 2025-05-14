
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';
import { sendErrorToChat } from '@/utils/error-handling/sendErrorToChat';

interface ReportOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  saveToDatabase?: boolean;
  sendToChatInterface?: boolean;
}

export function useErrorReporting() {
  const [isReporting, setIsReporting] = useState(false);
  
  // Αναφορά σφάλματος με διάφορες μεθόδους
  const reportError = useCallback((error: Error, options: ReportOptions = {}) => {
    const { 
      showToast = true, 
      logToConsole = true, 
      saveToDatabase = false,
      sendToChatInterface = false 
    } = options;
    
    // Καταγραφή στην κονσόλα
    if (logToConsole) {
      console.error("Reported error:", error);
    }
    
    // Προσθήκη στον συλλέκτη σφαλμάτων
    errorCollector.addError(error);
    
    // Εμφάνιση toast
    if (showToast) {
      toast.error(error.message, {
        description: "Μπορείτε να αποστείλετε αναφορά σφάλματος στο chat για ανάλυση",
        action: {
          label: "Αποστολή",
          onClick: () => sendErrorToChat(error)
        }
      });
    }
    
    // Αποστολή στο chat interface
    if (sendToChatInterface) {
      sendErrorToChat(error);
    }
    
    // Αποθήκευση στη βάση δεδομένων (σε μελλοντική έκδοση)
    if (saveToDatabase) {
      console.log("Saving error to database (future feature):", error);
    }
    
    return error;
  }, []);
  
  // Αποστολή σφάλματος απευθείας στο chat
  const sendErrorToLovableChat = useCallback((message: string, stack?: string) => {
    setIsReporting(true);
    try {
      sendErrorToChat(new Error(message), { stack });
      toast.success("Το σφάλμα στάλθηκε για ανάλυση");
    } catch (e) {
      console.error("Error sending to chat:", e);
      toast.error("Πρόβλημα αποστολής σφάλματος");
    } finally {
      setIsReporting(false);
    }
  }, []);
  
  return {
    reportError,
    sendErrorToChat: sendErrorToLovableChat,
    isReporting
  };
}
