
/**
 * Επιλογές για την εμφάνιση και καταγραφή σφαλμάτων
 */
export interface ErrorOptions {
  // Επιλογές εμφάνισης
  showToast?: boolean;
  logToConsole?: boolean;
  sendToChat?: boolean;
  useCollector?: boolean;
  
  // Μεταδεδομένα σφάλματος
  title?: string;
  component?: string;
  details?: any;
  source?: string;
  
  // Στοιχεία περιβάλλοντος
  url?: string;
  browserInfo?: any;
}

/**
 * Επιλογές για την εμφάνιση σφαλμάτων (συντομογραφία)
 */
export type ErrorDisplayOptions = ErrorOptions;

/**
 * Επιλογές για τον έλεγχο σφαλμάτων στα τεστ
 */
export type TestErrorOptions = ErrorOptions & {
  errorType?: string;
};
