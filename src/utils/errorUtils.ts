
/**
 * Βοηθητικές συναρτήσεις για την καταγραφή και εμφάνιση σφαλμάτων
 */
import { toast } from "sonner";

/**
 * Εμφανίζει ένα σφάλμα στον χρήστη με διάφορους τρόπους
 * @param error Το αντικείμενο σφάλματος ή το μήνυμα
 * @param options Επιλογές για τον τρόπο εμφάνισης
 */
export function displayError(
  error: unknown, 
  options: {
    title?: string,
    showToast?: boolean,
    logToConsole?: boolean,
    throwError?: boolean,
    sendToChat?: boolean
  } = {}
) {
  // Προεπιλεγμένες επιλογές
  const { 
    title = "Σφάλμα εφαρμογής", 
    showToast = true, 
    logToConsole = true,
    throwError = false,
    sendToChat = false
  } = options;

  // Εξαγωγή του μηνύματος σφάλματος
  let errorMessage: string;
  let errorObject: Error | null = null;

  if (error instanceof Error) {
    errorMessage = error.message;
    errorObject = error;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    errorMessage = error.message;
  } else {
    try {
      errorMessage = JSON.stringify(error);
    } catch {
      errorMessage = "Άγνωστο σφάλμα";
    }
  }

  // Εμφάνιση toast αν ζητηθεί
  if (showToast) {
    toast.error(title, {
      description: errorMessage,
      duration: 6000,
      action: sendToChat ? {
        label: "Αποστολή στο chat",
        onClick: () => sendErrorToChat(errorMessage, errorObject?.stack)
      } : undefined
    });
  }

  // Καταγραφή στην κονσόλα αν ζητηθεί
  if (logToConsole) {
    if (errorObject) {
      console.error("[ErrorUtils]", title, errorObject);
    } else {
      console.error("[ErrorUtils]", title, errorMessage);
    }
  }

  // Αποστολή στο chat αν ζητηθεί
  if (sendToChat && errorObject) {
    sendErrorToChat(errorMessage, errorObject.stack);
  } else if (sendToChat) {
    sendErrorToChat(errorMessage);
  }

  // Throw το σφάλμα αν ζητηθεί
  if (throwError && errorObject) {
    throw errorObject;
  } else if (throwError) {
    throw new Error(errorMessage);
  }
}

/**
 * Αποστέλλει ένα σφάλμα στο Lovable Chat interface
 */
export function sendErrorToChat(errorMessage: string, errorStack?: string) {
  try {
    // Δημιουργία του αντικειμένου σφάλματος
    const errorData = {
      type: 'error',
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    // Προσπάθεια χρήσης του lovableChat API αν υπάρχει
    if (window.lovableChat && typeof window.lovableChat.createErrorDialog === 'function') {
      window.lovableChat.createErrorDialog(errorData);
    } else {
      // Εναλλακτικά, χρήση events
      const event = new CustomEvent('lovable-error', { detail: errorData });
      window.dispatchEvent(event);
    }

    // Αντιγραφή στο πρόχειρο
    try {
      const clipboardText = `Παρακαλώ διορθώστε το παρακάτω σφάλμα:\n\nΜήνυμα: ${errorMessage}\n\n${errorStack ? `Stack Trace: ${errorStack}\n\n` : ''}Χρονοσήμανση: ${new Date().toISOString()}\nURL: ${window.location.href}`;
      
      navigator.clipboard.writeText(clipboardText)
        .then(() => {
          toast.success("Το σφάλμα αντιγράφηκε στο πρόχειρο");
        })
        .catch(e => {
          console.error("Αδυναμία αντιγραφής στο πρόχειρο:", e);
        });
    } catch (e) {
      console.error("Σφάλμα κατά την πρόσβαση στο clipboard API:", e);
    }
  } catch (e) {
    console.error("Αδυναμία αποστολής σφάλματος στο chat:", e);
  }
}

/**
 * Δημιουργεί έναν global αντικαταστάτη για το console.error που θα καταγράφει και θα εμφανίζει τα σφάλματα
 */
export function setupGlobalErrorHandling() {
  const originalConsoleError = console.error;
  
  console.error = (...args) => {
    // Καλεί την αρχική console.error πρώτα
    originalConsoleError.apply(console, args);
    
    // Δεν προχωράμε περισσότερο αν δεν υπάρχουν arguments
    if (args.length === 0) return;
    
    // Βγάζουμε το πρώτο argument ως πιθανό σφάλμα
    const firstArg = args[0];
    
    // Αγνοούμε συνηθισμένα React warnings
    if (typeof firstArg === 'string' && (
      firstArg.includes('ResizeObserver') ||
      firstArg.includes('findDOMNode') ||
      firstArg.includes('act(...)') ||
      firstArg.includes('React does not recognize') ||
      firstArg.includes('Missing `Description`')
    )) {
      return;
    }
    
    // Δημιουργούμε ένα πιο φιλικό μήνυμα για εμφάνιση
    let displayMessage = firstArg instanceof Error 
      ? firstArg.message 
      : (typeof firstArg === 'string' 
        ? firstArg 
        : 'Σφάλμα στην εφαρμογή');
    
    // Περιορίζουμε το μέγεθος του μηνύματος
    if (displayMessage.length > 150) {
      displayMessage = displayMessage.substring(0, 147) + '...';
    }

    // Εμφανίζουμε το σφάλμα με toast αλλά μόνο μία φορά ανά 5 δευτερόλεπτα
    // για το ίδιο μήνυμα (για να αποφύγουμε flood)
    if (!window._lastErrorDisplayTime || !window._lastErrorMessage || 
        window._lastErrorMessage !== displayMessage || 
        (Date.now() - window._lastErrorDisplayTime > 5000)) {
      
      window._lastErrorDisplayTime = Date.now();
      window._lastErrorMessage = displayMessage;
      
      displayError(firstArg, {
        title: 'Σφάλμα στην κονσόλα',
        showToast: true,
        logToConsole: false, // Το έχουμε ήδη καταγράψει
        sendToChat: true
      });
    }
  };

  // Προσθήκη των απαραίτητων πεδίων στο παράθυρο
  window._lastErrorDisplayTime = 0;
  window._lastErrorMessage = '';

  return () => {
    // Function to restore original console.error
    console.error = originalConsoleError;
  };
}
