
import { toast } from "sonner";
import { sendErrorToChat } from "./sendErrorToChat";
import { errorCollector } from "../error-handling/collector";

interface ErrorOptions {
  title?: string;
  showToast?: boolean;
  logToConsole?: boolean;
  sendToChat?: boolean; 
  useCollector?: boolean;
}

/**
 * Βοηθητική συνάρτηση για εμφάνιση σφαλμάτων με διάφορους τρόπους
 */
export function displayError(
  error: Error | string, 
  options: ErrorOptions = {
    showToast: true,
    logToConsole: true,
    sendToChat: false,
    useCollector: false
  }
) {
  const {
    title = "Σφάλμα", 
    showToast = true, 
    logToConsole = true, 
    sendToChat = false,
    useCollector = false
  } = options;
  
  // Μετατροπή του σφάλματος σε Error object αν είναι string
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  
  // Εμφάνιση toast αν ζητηθεί
  if (showToast) {
    toast.error(title, {
      description: errorObj.message,
      duration: 5000,
      action: sendToChat ? {
        label: "Αποστολή στο Chat",
        onClick: () => sendErrorToChat(errorObj),
      } : undefined
    });
  }
  
  // Καταγραφή στην κονσόλα αν ζητηθεί
  if (logToConsole) {
    console.error(errorObj);
  }
  
  // Αποστολή στο chat αν ζητηθεί
  if (sendToChat) {
    sendErrorToChat(errorObj);
  }
  
  // Χρήση του collector αν ζητηθεί
  if (useCollector) {
    errorCollector.addError(errorObj);
  }
  
  return errorObj;
}
