import { toast } from "sonner";
import { errorCollector } from "@/utils/errorCollector";

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
 * Εμφανίζει ομαδοποιημένα σφάλματα σε ένα toast και στην κονσόλα
 */
export function displayGroupedErrors(errors: (Error | string)[]) {
  if (errors.length === 0) return;

  // Δημιουργία τίτλου με βάση τον αριθμό των σφαλμάτων
  const title = errors.length === 1 
    ? "Εντοπίστηκε ένα σφάλμα" 
    : `Εντοπίστηκαν ${errors.length} σφάλματα`;
  
  // Δημιουργία σύντομης περιγραφής των σφαλμάτων
  const description = errors.map(err => 
    typeof err === 'string' ? err : err.message
  ).join('\n');
  
  // Εμφάνιση toast με όλα τα σφάλματα
  toast.error(title, {
    description: description.length > 200 
      ? description.substring(0, 200) + '...' 
      : description,
    duration: 6000,
    action: {
      label: "Λεπτομέρειες",
      onClick: () => {
        console.group("Λεπτομέρειες σφαλμάτων");
        errors.forEach((error, index) => {
          console.error(`Σφάλμα ${index + 1}:`, error);
        });
        console.groupEnd();
      }
    }
  });
  
  // Καταγραφή όλων των σφαλμάτων στην κονσόλα
  console.group("Ομαδοποιημένα σφάλματα");
  errors.forEach((error, index) => {
    console.error(`Σφάλμα ${index + 1}:`, error);
  });
  console.groupEnd();
  
  // Αποθήκευση των σφαλμάτων για αποστολή στο chat αν χρειαστεί
  const formattedErrors = errors.map(err => {
    const errorObj = typeof err === 'string' ? new Error(err) : err;
    return {
      message: errorObj.message,
      stack: errorObj.stack,
      timestamp: new Date().toISOString()
    };
  });
  
  try {
    localStorage.setItem('grouped_errors', JSON.stringify(formattedErrors));
  } catch (e) {
    console.error('Σφάλμα κατά την αποθήκευση ομαδοποιημένων σφαλμάτων:', e);
  }
}

/**
 * Ρυθμίζει τη συλλογή σφαλμάτων console.error και console.warn
 */
export function setupGlobalErrorHandling() {
  // Αποθήκευση των αρχικών συναρτήσεων
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  // Αντικατάσταση της console.error
  console.error = function(...args) {
    // Καλούμε την αρχική console.error
    originalConsoleError.apply(console, args);
    
    // Έλεγχος για σφάλματα
    const errorArg = args.find(arg => arg instanceof Error);
    
    if (errorArg && errorArg instanceof Error) {
      // Αποθήκευση του σφάλματος
      try {
        const consoleErrors = JSON.parse(localStorage.getItem('console_errors') || '[]');
        consoleErrors.push({
          message: errorArg.message,
          stack: errorArg.stack,
          timestamp: new Date().toISOString(),
          url: window.location.href
        });
        localStorage.setItem('console_errors', JSON.stringify(consoleErrors.slice(-20)));
      } catch (e) {
        // Αγνοούμε σφάλματα κατά την αποθήκευση
      }
    }
  };
  
  // Αντικατάσταση της console.warn
  console.warn = function(...args) {
    // Καλούμε την αρχική console.warn
    originalConsoleWarn.apply(console, args);
    
    // Αποθήκευση των warnings
    try {
      const warningMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      const consoleWarnings = JSON.parse(localStorage.getItem('console_warnings') || '[]');
      consoleWarnings.push({
        message: warningMessage,
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
      localStorage.setItem('console_warnings', JSON.stringify(consoleWarnings.slice(-10)));
    } catch (e) {
      // Αγνοούμε σφάλματα κατά την αποθήκευση
    }
  };
  
  // Επιστροφή συνάρτησης καθαρισμού
  return function cleanup() {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  };
}
