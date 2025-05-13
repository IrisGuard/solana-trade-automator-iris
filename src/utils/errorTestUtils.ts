
/**
 * Βοηθητικές συναρτήσεις για δοκιμή των σφαλμάτων και του συστήματος καταγραφής
 */

/**
 * Δημιουργεί ένα προσομοιωμένο σφάλμα και το αποστέλλει στο σύστημα καταγραφής σφαλμάτων
 * @param message Το μήνυμα του σφάλματος
 */
export function generateTestError(message = "Δοκιμαστικό σφάλμα για έλεγχο του συστήματος καταγραφής") {
  // Δημιουργία του σφάλματος
  const testError = new Error(message);
  
  // Καταγραφή του σφάλματος στην κονσόλα για να πιαστεί από το useConsoleErrorMonitor
  console.error(testError);
  
  // Αποστολή του σφάλματος απευθείας στο σύστημα παραθύρων διαλόγου
  if (window.lovableChat?.createErrorDialog) {
    window.lovableChat.createErrorDialog({
      message: testError.message,
      stack: testError.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });
  } else {
    // Εναλλακτική μέθοδος χρησιμοποιώντας custom event
    const event = new CustomEvent('lovable-error', {
      detail: {
        message: testError.message,
        stack: testError.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href
      }
    });
    window.dispatchEvent(event);
  }
  
  return testError;
}

/**
 * Καθαρίζει όλα τα υπάρχοντα σφάλματα από την εφαρμογή
 */
export function clearAllErrors() {
  // Καθαρισμός των σφαλμάτων που έχουν αποθηκευτεί στο localStorage
  try {
    localStorage.removeItem('lovable_chat_errors');
    console.log('Τα αποθηκευμένα σφάλματα καθαρίστηκαν');
  } catch (e) {
    console.error('Σφάλμα κατά τον καθαρισμό των σφαλμάτων:', e);
  }
  
  // Προσπάθεια κλήσης της συνάρτησης καθαρισμού σφαλμάτων από το hook
  try {
    const clearErrorsEvent = new CustomEvent('lovable-clear-errors');
    window.dispatchEvent(clearErrorsEvent);
    console.log('Στάλθηκε custom event για καθαρισμό σφαλμάτων');
  } catch (e) {
    console.error('Σφάλμα κατά την αποστολή του event καθαρισμού:', e);
  }
  
  // Προσπάθεια απευθείας καθαρισμού μέσω του window object
  if (window.lovableChat && typeof window.lovableChat.clearErrors === 'function') {
    window.lovableChat.clearErrors();
    console.log('Κλήθηκε η μέθοδος window.lovableChat.clearErrors()');
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
    generateTestError("Δοκιμαστικό σφάλμα από το κουμπί ελέγχου");
  });
  
  // Προσθήκη του κουμπιού στο σώμα της σελίδας
  document.body.appendChild(button);
}
