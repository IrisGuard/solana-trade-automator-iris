
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { errorCollector, type ErrorData } from '@/utils/error-handling/collector';
import { sendErrorToChat } from '@/utils/error-handling/sendErrorToChat';

interface ReportOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  saveToDatabase?: boolean;
  sendToChatInterface?: boolean;
}

export function useErrorReporting() {
  const [isReporting, setIsReporting] = useState(false);
  
  // Report error with various methods
  const reportError = useCallback((error: Error, options: ReportOptions = {}) => {
    const { 
      showToast = true, 
      logToConsole = true, 
      saveToDatabase = false,
      sendToChatInterface = false 
    } = options;
    
    // Log to console
    if (logToConsole) {
      console.error("Reported error:", error);
    }
    
    // Add to error collector with conversion to ErrorData
    const errorData: ErrorData = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now()
    };
    errorCollector.collect(error);
    
    // Show toast
    if (showToast) {
      toast.error(error.message, {
        description: "Μπορείτε να αποστείλετε αναφορά σφάλματος στο chat για ανάλυση",
        action: {
          label: "Αποστολή",
          onClick: () => sendErrorToChat(error)
        }
      });
    }
    
    // Send to chat interface
    if (sendToChatInterface) {
      sendErrorToChat(error);
    }
    
    // Save to database (future feature)
    if (saveToDatabase) {
      console.log("Saving error to database (future feature):", error);
    }
    
    return error;
  }, []);
  
  // Send all collected errors to server
  const reportCollectedErrors = useCallback(async () => {
    setIsReporting(true);
    try {
      await errorCollector.reportErrors();
      return "success";
    } catch (e) {
      console.error("Error reporting collected errors:", e);
      toast.error("Πρόβλημα αποστολής συλλεγμένων σφαλμάτων");
      return "error";
    } finally {
      setIsReporting(false);
    }
  }, []);
  
  // Send error directly to chat
  const sendErrorToLovableChat = useCallback((message: string, stack?: string) => {
    setIsReporting(true);
    try {
      sendErrorToChat(new Error(message), { stack });
      toast.success("Το σφάλμα στάλθηκε για ανάλυση");
      return "success";
    } catch (e) {
      console.error("Error sending to chat:", e);
      toast.error("Πρόβλημα αποστολής σφάλματος");
      return "error";
    } finally {
      setIsReporting(false);
    }
  }, []);
  
  return {
    reportError,
    reportCollectedErrors,
    sendErrorToChat: sendErrorToLovableChat,
    isReporting
  };
}
