
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
    sendToChat = true
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
  if (sendToChat) {
    if (errorObject) {
      sendErrorToChat(errorMessage, errorObject.stack);
    } else {
      sendErrorToChat(errorMessage);
    }
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
  const originalConsoleWarn = console.warn;
  
  // Αντικατάσταση του console.error
  console.error = (...args) => {
    // Καλεί την αρχική console.error πρώτα
    originalConsoleError.apply(console, args);
    
    // Δεν προχωράμε περισσότερο αν δεν υπάρχουν arguments
    if (args.length === 0) return;
    
    // Βγάζουμε το πρώτο argument ως πιθανό σφάλμα
    const firstArg = args[0];
    
    // Αγνοούμε συνηθισμένα React warnings και εσωτερικά μηνύματα
    if (typeof firstArg === 'string' && (
      firstArg.includes('ResizeObserver') ||
      firstArg.includes('findDOMNode') ||
      firstArg.includes('act(...)') ||
      firstArg.includes('React does not recognize') ||
      firstArg.includes('Missing `Description`') ||
      firstArg.includes('[ErrorUtils]') ||
      firstArg.includes('Αδυναμία αντιγραφής') ||
      firstArg.includes('clearAllErrors')
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

    // Αποθήκευση μοναδικού αναγνωριστικού σφάλματος για αποφυγή διπλότυπων
    const errorId = `${displayMessage.substring(0, 50)}`;
    const lastErrorTime = window._lastErrorDisplayTimes?.[errorId] || 0;
    
    // Έλεγχος αν το ίδιο σφάλμα έχει εμφανιστεί πρόσφατα (τελευταία 5 δευτερόλεπτα)
    if (!window._lastErrorDisplayTimes || !window._lastErrorDisplayTimes[errorId] || 
        (Date.now() - lastErrorTime > 5000)) {
      
      // Ενημέρωση χρόνου τελευταίας εμφάνισης
      if (!window._lastErrorDisplayTimes) window._lastErrorDisplayTimes = {};
      window._lastErrorDisplayTimes[errorId] = Date.now();
      
      // Αποστολή στο σύστημα εμφάνισης σφαλμάτων
      displayError(firstArg, {
        title: 'Σφάλμα στην κονσόλα',
        showToast: false, // Όχι toast για να αποφύγουμε διπλές ειδοποιήσεις
        logToConsole: false, // Το έχουμε ήδη καταγράψει
        sendToChat: true // Αποστολή στο chat interface
      });
    }
  };

  // Αντικατάσταση του console.warn για σημαντικές προειδοποιήσεις
  console.warn = (...args) => {
    // Καλεί την αρχική console.warn πρώτα
    originalConsoleWarn.apply(console, args);
    
    // Δεν προχωράμε περισσότερο αν δεν υπάρχουν arguments
    if (args.length === 0) return;
    
    // Βγάζουμε το πρώτο argument
    const firstArg = args[0];
    
    // Αναζητάμε σημαντικές προειδοποιήσεις
    const importantWarnings = [
      "supabase", "authentication", "database", "unauthorized", "permission", "axios", 
      "api", "connection", "wallet", "solana", "transaction"
    ];
    
    // Ελέγχουμε αν η προειδοποίηση είναι σημαντική
    let isImportant = false;
    if (typeof firstArg === 'string') {
      isImportant = importantWarnings.some(term => 
        firstArg.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    // Αν είναι σημαντική, στέλνουμε την προειδοποίηση και στο chat
    if (isImportant) {
      const warningMessage = typeof firstArg === 'string' 
        ? firstArg 
        : (firstArg instanceof Error 
          ? firstArg.message 
          : 'Σημαντική προειδοποίηση');
      
      displayError({
        message: `Προειδοποίηση: ${warningMessage}`,
        stack: typeof firstArg !== 'string' && firstArg instanceof Error ? firstArg.stack : undefined
      }, {
        title: 'Σημαντική προειδοποίηση',
        showToast: true,
        logToConsole: false,
        sendToChat: true
      });
    }
  };
  
  // Προσθήκη αποθήκευσης χρόνων εμφάνισης σφαλμάτων
  if (!window._lastErrorDisplayTimes) {
    window._lastErrorDisplayTimes = {};
  }

  // Προσθήκη χειριστή για μη συλληφθέντα σφάλματα (uncaught errors)
  const handleUncaughtError = (event: ErrorEvent) => {
    event.preventDefault();
    
    displayError({
      message: event.message,
      stack: event.error?.stack
    }, {
      title: 'Μη συλληφθέν σφάλμα',
      showToast: true,
      logToConsole: true,
      sendToChat: true
    });
  };
  
  // Προσθήκη χειριστή για απόρριψη υποσχέσεων (unhandled rejections)
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    event.preventDefault();
    
    const error = event.reason;
    displayError(error, {
      title: 'Μη διαχειρίσιμη απόρριψη υπόσχεσης',
      showToast: true,
      logToConsole: true,
      sendToChat: true
    });
  };

  // Προσθήκη χειριστή για σφάλματα δικτύου
  const handleNetworkError = (event: Event) => {
    // Έλεγχος για σφάλμα δικτύου
    if (event.target instanceof XMLHttpRequest) {
      const xhr = event.target;
      if (xhr.status >= 400) {
        displayError(`Σφάλμα δικτύου: ${xhr.status} ${xhr.statusText}`, {
          title: 'Σφάλμα API',
          showToast: true,
          logToConsole: true,
          sendToChat: true
        });
      }
    }
  };
  
  // Προσθήκη των event listeners
  window.addEventListener('error', handleUncaughtError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  window.addEventListener('xhr', handleNetworkError);
  
  // Επιστροφή συνάρτησης καθαρισμού
  return () => {
    // Επαναφορά των αρχικών συναρτήσεων
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    
    // Αφαίρεση των event listeners
    window.removeEventListener('error', handleUncaughtError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    window.removeEventListener('xhr', handleNetworkError);
  };
}

/**
 * Ομαδοποιεί πολλαπλά σφάλματα και τα εμφανίζει μαζί
 * @param errors Πίνακας σφαλμάτων
 */
export function displayGroupedErrors(errors: (Error | string)[]) {
  if (errors.length === 0) return;
  
  // Αν υπάρχει μόνο ένα σφάλμα, το εμφανίζουμε μεμονωμένα
  if (errors.length === 1) {
    displayError(errors[0]);
    return;
  }
  
  // Δημιουργία συγκεντρωτικού μηνύματος
  const errorMessages = errors.map(err => {
    if (err instanceof Error) {
      return err.message;
    }
    return String(err);
  });
  
  // Εμφάνιση ομαδοποιημένων σφαλμάτων
  const message = `Εντοπίστηκαν ${errors.length} σφάλματα:\n\n${errorMessages.join('\n\n')}`;
  
  // Δημιουργία stack trace για όλα τα σφάλματα που είναι Error objects
  const stackTraces = errors
    .filter((err): err is Error => err instanceof Error && !!err.stack)
    .map(err => `--- ${err.message} ---\n${err.stack}`);
  
  const combinedStack = stackTraces.length > 0 ? stackTraces.join('\n\n') : undefined;
  
  // Εμφάνιση όλων των σφαλμάτων ως ένα μήνυμα
  displayError({
    message, 
    stack: combinedStack
  }, {
    title: `Πολλαπλά σφάλματα (${errors.length})`,
    showToast: true,
    logToConsole: true,
    sendToChat: true
  });
  
  // Επιπλέον εμφάνιση κάθε σφάλματος ξεχωριστά στο chat
  errors.forEach(err => {
    if (err instanceof Error) {
      sendErrorToChat(err.message, err.stack);
    } else {
      sendErrorToChat(String(err));
    }
  });
}
