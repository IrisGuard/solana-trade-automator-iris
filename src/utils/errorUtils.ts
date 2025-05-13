
import { toast } from "sonner";
import { ErrorCollector } from "@/utils/errorCollector";

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
    ErrorCollector.add(errorObj);
  }
  
  return errorObj;
}

/**
 * Αποστέλλει ένα σφάλμα στο Lovable Chat για διάγνωση
 */
export function sendErrorToChat(error: Error | string, stack?: string) {
  try {
    // Προετοιμασία των δεδομένων σφάλματος
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? stack : error.stack;
    const timestamp = new Date().toISOString();
    const url = window.location.href;
    
    // Δημιουργία αντικειμένου σφάλματος
    const errorData = {
      type: 'error',
      message: errorMessage,
      stack: errorStack,
      timestamp,
      url
    };
    
    // Αποθήκευση στο localStorage για το Lovable Chat
    const storedErrors = JSON.parse(localStorage.getItem('lovable_chat_errors') || '[]');
    storedErrors.push(errorData);
    localStorage.setItem('lovable_chat_errors', JSON.stringify(storedErrors));
    
    // Αντιγραφή στο clipboard για εύκολο paste
    try {
      const errorText = `
Παρακαλώ διορθώστε το παρακάτω σφάλμα:

Μήνυμα: ${errorMessage}

${errorStack ? `Stack: ${errorStack}` : ''}
Χρονοσήμανση: ${new Date().toLocaleString()}
URL: ${url}
`;
      
      navigator.clipboard.writeText(errorText);
      toast.success('Αντιγράφηκε στο πρόχειρο, επικολλήστε το στο chat');
    } catch (clipboardErr) {
      console.error('Αδυναμία αντιγραφής στο πρόχειρο:', clipboardErr);
    }
    
    // Αποστολή γεγονότος για να ενημερώσει το Lovable
    window.dispatchEvent(new CustomEvent('lovable-error', { detail: errorData }));
    
    return true;
  } catch (e) {
    console.error('Σφάλμα κατά την αποστολή σφάλματος στο chat:', e);
    return false;
  }
}

/**
 * Κατευθύνει πιθανά σφάλματα console.error στο σύστημα διαχείρισης σφαλμάτων
 */
export function setupConsoleErrorHook() {
  const originalConsoleError = console.error;

  console.error = function(...args) {
    // Καλούμε την αρχική console.error για διατήρηση της συμπεριφοράς
    originalConsoleError.apply(console, args);
    
    // Προσπαθούμε να βρούμε αν υπάρχει Error object στα arguments
    const errorArg = args.find(arg => arg instanceof Error);
    
    if (errorArg && errorArg instanceof Error) {
      // Αποθηκεύουμε το σφάλμα για πιθανή χρήση αργότερα
      const errorDetails = {
        message: errorArg.message,
        stack: errorArg.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };
      
      try {
        const consoleErrors = JSON.parse(localStorage.getItem('console_errors') || '[]');
        consoleErrors.push(errorDetails);
        localStorage.setItem('console_errors', JSON.stringify(consoleErrors.slice(-20)));
      } catch (e) {
        // Αγνοούμε σφάλματα κατά την αποθήκευση
      }
    }
  };
}

/**
 * Παρόμοιο hook για warning μηνύματα
 */
export function setupConsoleWarningHook() {
  const originalConsoleWarn = console.warn;
  
  console.warn = function(...args) {
    // Καλούμε την αρχική console.warn
    originalConsoleWarn.apply(console, args);
    
    // Αποθηκεύουμε τα warnings για πιθανή διάγνωση αργότερα
    try {
      const warningMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      const warningDetails = {
        message: warningMessage,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };
      
      const consoleWarnings = JSON.parse(localStorage.getItem('console_warnings') || '[]');
      consoleWarnings.push(warningDetails);
      localStorage.setItem('console_warnings', JSON.stringify(consoleWarnings.slice(-10)));
    } catch (e) {
      // Αγνοούμε σφάλματα κατά την αποθήκευση
    }
  };
}
