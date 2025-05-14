/**
 * Βοηθητικές συναρτήσεις για δοκιμή των σφαλμάτων και του συστήματος καταγραφής
 */
import { displayError, displayGroupedErrors } from './errorUtils';
import { errorCollector } from './errorCollector';

/**
 * Δημιουργεί ένα προσομοιωμένο σφάλμα και το αποστέλλει στο σύστημα καταγραφής σφαλμάτων
 * @param message Το μήνυμα του σφάλματος
 * @param options Επιλογές για τον τρόπο εμφάνισης
 */
export function generateTestError(
  message = "Δοκιμαστικό σφάλμα για έλεγχο του συστήματος καταγραφής", 
  options = { showToast: true, logToConsole: true, sendToChat: true, useCollector: false }
) {
  // Καθαρισμός υπαρχόντων σφαλμάτων πρώτα
  clearAllErrors();
  
  // Περιμένουμε λίγο πριν δημιουργήσουμε το νέο σφάλμα
  setTimeout(() => {
    // Δημιουργία του σφάλματος
    const testError = new Error(message);
    
    if (options.useCollector) {
      // Αποστολή στον συλλέκτη σφαλμάτων
      errorCollector.addError(testError);
    } else {
      // Εμφάνιση του σφάλματος με τις επιλεγμένες επιλογές
      displayError(testError, {
        title: 'Δοκιμαστικό Σφάλμα',
        ...options
      });
    }
  }, 500);
}

/**
 * Καθαρίζει όλα τα υπάρχοντα σφάλματα από την εφαρμογή
 */
export function clearAllErrors() {
  // Καθαρισμός του συλλέκτη σφαλμάτων
  errorCollector.clearErrors();

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
  
  // Πίνακας με τα σφάλματα που θα δημιουργηθούν
  const errors = [
    new Error('Δοκιμαστικό σφάλμα 1: Απλό σφάλμα'),
    'Δοκιμαστικό σφάλμα 2: Σφάλμα ως string χωρίς stack trace',
    new Error('Δοκιμαστικό σφάλμα 3: Προσομοίωση σφάλματος Supabase'),
    new Error('Δοκιμαστικό σφάλμα 4: Προσομοίωση σφάλματος δικτύου')
  ];
  
  // Προσθήκη των σφαλμάτων στον συλλέκτη με μικρές καθυστερήσεις
  errors.forEach((error, index) => {
    setTimeout(() => {
      errorCollector.addError(error);
    }, index * 500);
  });
  
  // Αποστολή μετά από 3 δευτερόλεπτα όλων των σφαλμάτων αν δεν έχουν σταλεί ακόμα
  setTimeout(() => {
    errorCollector.sendCollectedErrors();
  }, 3000);
}

/**
 * Δημιουργεί δοκιμαστικά σφάλματα Supabase
 */
export function generateSupabaseErrors() {
  // Δοκιμαστικά σφάλματα Supabase
  const supabaseErrors = [
    new Error('Σφάλμα σύνδεσης με τη βάση δεδομένων Supabase'),
    new Error('Σφάλμα αυθεντικοποίησης: Μη έγκυρο JWT token'),
    new Error('Σφάλμα RLS: Δεν υπάρχουν δικαιώματα για την ενέργεια αυτή'),
    new Error('Σφάλμα απόδοσης δεδομένων: Μη έγκυρη απάντηση από το Supabase API')
  ];
  
  // Άμεση αποστολή των σφαλμάτων ως ομάδα
  displayGroupedErrors(supabaseErrors);
}
