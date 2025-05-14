
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
}

/**
 * Συντομογραφία για το ErrorOptions
 * για συμβατότητα με παλαιότερα σημεία χρήσης
 */
export type ErrorDisplayOptions = ErrorOptions;

/**
 * Επιλογές για τον έλεγχο σφαλμάτων στα τεστ
 */
export type TestErrorOptions = ErrorOptions & {
  errorType?: "type" | "promise" | "async" | "reference" | "syntax" | "timeout" | "render" | "prop" | "state" | "network";
};
