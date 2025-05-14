
/**
 * Ρυθμίζει τη συλλογή σφαλμάτων console.error και console.warn
 */
export function setupGlobalErrorHandling() {
  // Αποθήκευση των αρχικών συναρτήσεων
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  // Αντικατάσταση της console.error
  console.error = function(...args) {
    // Καλούμε την αρχική console.error
    originalConsoleError.apply(console, args);
    
    // Έλεγχος για σφάλματα
    const errorArg = args.find(arg => arg instanceof Error);
    
    if (errorArg && errorArg instanceof Error) {
      // Αποθήκευση του σφάλματος
      try {
        const consoleErrors = JSON.parse(localStorage.getItem('console_errors') || '[]');
        consoleErrors.push({
          message: errorArg.message,
          stack: errorArg.stack,
          timestamp: new Date().toISOString(),
          url: window.location.href
        });
        localStorage.setItem('console_errors', JSON.stringify(consoleErrors.slice(-20)));
      } catch (e) {
        // Αγνοούμε σφάλματα κατά την αποθήκευση
      }
    }
  };
  
  // Αντικατάσταση της console.warn
  console.warn = function(...args) {
    // Καλούμε την αρχική console.warn
    originalConsoleWarn.apply(console, args);
    
    // Αποθήκευση των warnings
    try {
      const warningMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      const consoleWarnings = JSON.parse(localStorage.getItem('console_warnings') || '[]');
      consoleWarnings.push({
        message: warningMessage,
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
      localStorage.setItem('console_warnings', JSON.stringify(consoleWarnings.slice(-10)));
    } catch (e) {
      // Αγνοούμε σφάλματα κατά την αποθήκευση
    }
  };
  
  // Επιστροφή συνάρτησης καθαρισμού
  return function cleanup() {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  };
}
