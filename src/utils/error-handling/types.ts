
/**
 * Επιλογές για την καταγραφή σφαλμάτων
 */
export interface ErrorDisplayOptions {
  component?: string;  // Όνομα του component που προκάλεσε το σφάλμα
  details?: any;       // Επιπλέον λεπτομέρειες σχετικά με το σφάλμα
  source?: string;     // Πηγή του σφάλματος (client, server, etc)
}

/**
 * Δεδομένα σφάλματος για την καταγραφή
 */
export interface ErrorData {
  id: string;          // Μοναδικό αναγνωριστικό του σφάλματος
  message: string;     // Μήνυμα σφάλματος
  stack: string;       // Stack trace
  component: string;   // Component που προκάλεσε το σφάλμα
  source: string;      // Πηγή του σφάλματος
  details: any;        // Επιπλέον λεπτομέρειες
  timestamp: string;   // Χρονική σήμανση του σφάλματος
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
