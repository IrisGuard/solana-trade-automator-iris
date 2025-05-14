
// Βασικοί τύποι για τη διαχείριση σφαλμάτων

export interface ErrorDisplayOptions {
  title?: string;
  component?: string;
  details?: any;
  showToast?: boolean;
  logToConsole?: boolean;
  source?: string;
}

export type ErrorOptions = ErrorDisplayOptions;

export interface TestErrorOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  sendToChat?: boolean;
  component?: string;
  useCollector?: boolean;
}
