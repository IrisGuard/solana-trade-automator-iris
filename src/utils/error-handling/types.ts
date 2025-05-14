
/**
 * Επιλογές για το χειρισμό σφαλμάτων
 */
export interface ErrorOptions {
  title?: string;
  showToast?: boolean;
  toastType?: 'error' | 'warning' | 'info';
  logToConsole?: boolean;
  sendToChat?: boolean;
  useCollector?: boolean;
  rethrow?: boolean;
  silent?: boolean;
  // Adding the missing properties that are being used across the app
  component?: string;
  details?: any;
  source?: string;
}

/**
 * Συντομογραφία για το ErrorOptions
 * για συμβατότητα με παλαιότερα σημεία χρήσης
 */
export type ErrorDisplayOptions = ErrorOptions;

/**
 * Επιλογές για τον έλεγχο σφαλμάτων στα τεστ
 */
export interface TestErrorOptions {
  errorType?: "type" | "promise" | "async" | "reference" | "syntax" | "timeout" | "render" | "prop" | "state" | "network";
  component?: string;
  details?: any;
  source?: string;
}
