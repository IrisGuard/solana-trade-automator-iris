
/**
 * Επιλογές για την καταγραφή σφαλμάτων
 */
export interface ErrorDisplayOptions {
  component?: string;  // Όνομα του component που προκάλεσε το σφάλμα
  details?: any;       // Επιπλέον λεπτομέρειες σχετικά με το σφάλμα
  source?: string;     // Πηγή του σφάλματος (client, server, etc)
  title?: string;      // Τίτλος του μηνύματος σφάλματος
  showToast?: boolean; // Αν θα εμφανιστεί toast
  logToConsole?: boolean; // Αν θα καταγραφεί στην κονσόλα
  useCollector?: boolean; // Αν θα χρησιμοποιηθεί ο collector
  sendToChat?: boolean;   // Αν θα σταλεί στο chat
  method?: string;        // Μέθοδος που προκάλεσε το σφάλμα
  toastDuration?: number; // Διάρκεια του toast
}

/**
 * Options for errorCollector.captureError
 */
export interface ErrorOptions {
  component?: string;
  details?: any;
  source?: string;
  title?: string;
  url?: string;
  browserInfo?: Record<string, any>;
}

/**
 * Δεδομένα σφάλματος για την καταγραφή
 */
export interface ErrorData {
  id: string;          // Μοναδικό αναγνωριστικό του σφάλματος
  message: string;     // Μήνυμα σφάλματος
  stack?: string;       // Stack trace
  component?: string;   // Component που προκάλεσε το σφάλμα
  source?: string;      // Πηγή του σφάλματος
  details?: any;        // Επιπλέον λεπτομέρειες
  timestamp: string | number;   // Χρονική σήμανση του σφάλματος
}

/**
 * Επιλογές για τα δοκιμαστικά σφάλματα
 */
export interface TestErrorOptions {
  errorType?: 'reference' | 'type' | 'syntax' | 'promise' | 'async' | 'timeout' | 'render' | 'prop' | 'state' | 'network';
  component?: string;
  details?: any;
  source?: string;
}
