
/**
 * Βοηθητικές συναρτήσεις για δοκιμή των σφαλμάτων και του συστήματος καταγραφής
 */
import { displayError } from './errorUtils';

/**
 * Δημιουργεί ένα προσομοιωμένο σφάλμα και το αποστέλλει στο σύστημα καταγραφής σφαλμάτων
 * @param message Το μήνυμα του σφάλματος
 * @param options Επιλογές για τον τρόπο εμφάνισης
 */
export function generateTestError(
  message = "Δοκιμαστικό σφάλμα για έλεγχο του συστήματος καταγραφής", 
  options = { showToast: true, logToConsole: true, sendToChat: true }
) {
  // Καθαρισμός υπαρχόντων σφαλμάτων πρώτα
  clearAllErrors();
  
  // Περιμένουμε λίγο πριν δημιουργήσουμε το νέο σφάλμα
  setTimeout(() => {
    // Δημιουργία του σφάλματος
    const testError = new Error(message);
    
    // Εμφάνιση του σφάλματος με τις επιλεγμένες επιλογές
    displayError(testError, {
      title: 'Δοκιμαστικό Σφάλμα',
      ...options
    });
  }, 500);
}

/**
 * Καθαρίζει όλα τα υπάρχοντα σφάλματα από την εφαρμογή
 */
export function clearAllErrors() {
  // Καθαρισμός των σφαλμάτων που έχουν αποθηκευτεί στο localStorage
  try {
    localStorage.removeItem('lovable_chat_errors');
  } catch (e) {
    console.error('Σφάλμα κατά τον καθαρισμό των σφαλμάτων από το localStorage:', e);
  }
  
  // Αποστολή event καθαρισμού
  try {
    const clearErrorsEvent = new CustomEvent('lovable-clear-errors');
    window.dispatchEvent(clearErrorsEvent);
  } catch (e) {
    console.error('Σφάλμα κατά την αποστολή του event καθαρισμού:', e);
  }
  
  // Απευθείας καθαρισμός μέσω του window object
  if (window.lovableChat && typeof window.lovableChat.clearErrors === 'function') {
    try {
      window.lovableChat.clearErrors();
    } catch (e) {
      console.error('Σφάλμα κατά τον καθαρισμό από το lovableChat:', e);
    }
  }
}

/**
 * Δημιουργεί διάφορους τύπους σφαλμάτων για δοκιμές
 */
export function generateVariousErrors() {
  // Καθαρισμός υπαρχόντων σφαλμάτων
  clearAllErrors();
  
  // Δημιουργία διαφόρων σφαλμάτων με διαφορετικές καθυστερήσεις
  setTimeout(() => {
    console.error(new Error('Δοκιμαστικό σφάλμα 1: Απλό σφάλμα'));
  }, 500);
  
  setTimeout(() => {
    console.error('Δοκιμαστικό σφάλμα 2: Σφάλμα ως string χωρίς stack trace');
  }, 1500);
  
  setTimeout(() => {
    try {
      // Προκαλούμε ένα σφάλμα
      const nullObj: any = null;
      nullObj.someProperty = 'test';
    } catch (e) {
      console.error('Δοκιμαστικό σφάλμα 3: Πιασμένη εξαίρεση', e);
    }
  }, 2500);
  
  setTimeout(() => {
    const error = new Error('Δοκιμαστικό σφάλμα 4: Σφάλμα με προσαρμοσμένο stack');
    error.stack = 'Προσομοιωμένο Stack\n  at function1 (file1.js:10:20)\n  at function2 (file2.js:30:10)';
    console.error(error);
  }, 3500);
}
