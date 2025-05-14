
import { toast } from "sonner";
import { errorCollector } from "./collector";

export interface ErrorDisplayOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  sendToChat?: boolean;
  useCollector?: boolean;
  component?: string;
  details?: any;
  source?: string;
}

/**
 * Εμφανίζει το σφάλμα με διάφορους τρόπους ανάλογα με τις επιλογές
 */
export function displayError(
  error: Error | string,
  options: ErrorDisplayOptions = {}
) {
  const {
    showToast = true,
    logToConsole = true,
    sendToChat = false,
    useCollector = true,
    component = 'unknown',
    details = {},
    source = 'client'
  } = options;

  // Δημιουργία μηνύματος σφάλματος
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  // Καθαρισμός του stack trace για καλύτερη αναγνωσιμότητα
  const cleanStack = typeof error === 'string' 
    ? '' 
    : error.stack
      ?.split('\n')
      .slice(0, 5)
      .join('\n') || '';

  // Εμφάνιση toast αν ζητηθεί
  if (showToast) {
    toast.error(errorMessage, {
      description: "Δείτε την κονσόλα για περισσότερες λεπτομέρειες",
      duration: 5000
    });
  }

  // Καταγραφή στην κονσόλα αν ζητηθεί
  if (logToConsole) {
    console.error("[Error]", errorMessage);
    if (cleanStack) {
      console.error("Stack:", cleanStack);
    }
    if (Object.keys(details).length > 0) {
      console.error("Details:", details);
    }
  }

  // Χρήση του error collector αν ζητηθεί
  if (useCollector) {
    errorCollector.reportError(error, component, details, source);
  }

  // Αποστολή στο chat (υλοποίηση αργότερα)
  if (sendToChat) {
    // TODO: Υλοποίηση αποστολής σφάλματος στο chat
    console.log("Send to chat requested but not implemented yet");
  }

  return {
    message: errorMessage,
    stack: cleanStack,
    component,
    source,
    details
  };
}
