
/**
 * Βασικές λειτουργίες χειρισμού σφαλμάτων για την εφαρμογή.
 */

// Μορφή καταγραφής σφαλμάτων
interface ErrorLogFormat {
  timestamp: string;
  message: string;
  component?: string;
  details?: any;
}

// Συλλογή των σφαλμάτων σε μνήμη
const errorLogs: ErrorLogFormat[] = [];

/**
 * Καταγράφει ένα σφάλμα με δομημένο τρόπο.
 * 
 * @param message Το μήνυμα σφάλματος
 * @param component Το συστατικό ή η υπηρεσία που παρήγαγε το σφάλμα
 * @param details Προαιρετικές λεπτομέρειες σφάλματος
 */
export function logError(message: string, component?: string, details?: any) {
  const errorLog: ErrorLogFormat = {
    timestamp: new Date().toISOString(),
    message,
    component,
    details
  };
  
  // Προσθήκη στη συλλογή σφαλμάτων
  errorLogs.push(errorLog);
  
  // Καταγραφή στην κονσόλα
  console.error(`[${component || 'Unknown'}]`, message, details || '');
  
  return errorLog;
}

/**
 * Λήψη όλων των καταγεγραμμένων σφαλμάτων.
 */
export function getErrorLogs(): ErrorLogFormat[] {
  return [...errorLogs];
}

/**
 * Καθαρισμός όλων των καταγεγραμμένων σφαλμάτων.
 */
export function clearErrorLogs(): void {
  errorLogs.length = 0;
}

/**
 * Εμφανίζει ένα σφάλμα στο UI (Toast notification).
 */
export function displayError(error: Error | string, options?: any) {
  const errorMessage = error instanceof Error ? error.message : error;
  
  // Καταγραφή στην κονσόλα
  logError(errorMessage, options?.component);
  
  // Άλλες ενέργειες όπως εμφάνιση toast θα προστεθούν εδώ
  return {
    message: errorMessage,
    timestamp: new Date().toISOString(),
    component: options?.component
  };
}
