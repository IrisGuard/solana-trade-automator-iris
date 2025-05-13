
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
