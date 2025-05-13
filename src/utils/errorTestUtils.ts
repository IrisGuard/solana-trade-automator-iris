
/**
 * Βοηθητικές συναρτήσεις για δοκιμή των σφαλμάτων και του συστήματος καταγραφής
 */

/**
 * Δημιουργεί ένα προσομοιωμένο σφάλμα και το αποστέλλει στο σύστημα καταγραφής σφαλμάτων
 * @param message Το μήνυμα του σφάλματος
 */
export function generateTestError(message = "Δοκιμαστικό σφάλμα για έλεγχο του συστήματος καταγραφής") {
  // Καθαρισμός υπαρχόντων σφαλμάτων πρώτα
  clearAllErrors();
  
  // Περιμένουμε λίγο πριν δημιουργήσουμε το νέο σφάλμα
  setTimeout(() => {
    // Δημιουργία του σφάλματος
    const testError = new Error(message);
    
    // Καταγραφή του σφάλματος στην κονσόλα για να πιαστεί από το useConsoleErrorMonitor
    console.error(testError);
  }, 300);
}

/**
 * Καθαρίζει όλα τα υπάρχοντα σφάλματα από την εφαρμογή
 */
export function clearAllErrors() {
  // Καθαρισμός των σφαλμάτων που έχουν αποθηκευτεί στο localStorage
  try {
    localStorage.removeItem('lovable_chat_errors');
  } catch (e) {
    console.error('Σφάλμα κατά τον καθαρισμό των σφαλμάτων:', e);
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
    window.lovableChat.clearErrors();
  }
}

/**
 * Προσθέτει ένα κουμπί στη σελίδα που εμφανίζει ένα δοκιμαστικό σφάλμα
 */
export function addTestErrorButton() {
  // Έλεγχος αν υπάρχει ήδη το κουμπί
  if (document.getElementById('test-error-button')) {
    return;
  }
  
  // Δημιουργία του κουμπιού
  const button = document.createElement('button');
  button.id = 'test-error-button';
  button.innerText = 'Δοκιμή Σφάλματος';
  button.style.position = 'fixed';
  button.style.bottom = '10px';
  button.style.right = '10px';
  button.style.zIndex = '9999';
  button.style.padding = '8px 16px';
  button.style.backgroundColor = '#ef4444';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  
  // Προσθήκη του χειριστή συμβάντων
  button.addEventListener('click', () => {
    clearAllErrors();
    setTimeout(() => {
      generateTestError("Δοκιμαστικό σφάλμα από το κουμπί ελέγχου");
    }, 300);
  });
  
  // Προσθήκη του κουμπιού στο σώμα της σελίδας
  document.body.appendChild(button);
}
