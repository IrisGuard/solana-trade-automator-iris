
import { toast } from "sonner";

/**
 * Αποστέλλει ένα σφάλμα στο Lovable Chat για διάγνωση
 */
export function sendErrorToChat(error: Error | string, stack?: string) {
  try {
    // Προετοιμασία των δεδομένων σφάλματος
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? stack : error.stack;
    const timestamp = new Date().toISOString();
    const url = window.location.href;
    
    // Δημιουργία αντικειμένου σφάλματος
    const errorData = {
      type: 'error',
      message: errorMessage,
      stack: errorStack,
      timestamp,
      url
    };
    
    // Αποθήκευση στο localStorage για το Lovable Chat
    const storedErrors = JSON.parse(localStorage.getItem('lovable_chat_errors') || '[]');
    storedErrors.push(errorData);
    localStorage.setItem('lovable_chat_errors', JSON.stringify(storedErrors));
    
    // Αντιγραφή στο clipboard για εύκολο paste
    try {
      const errorText = `
Παρακαλώ διορθώστε το παρακάτω σφάλμα:

Μήνυμα: ${errorMessage}

${errorStack ? `Stack: ${errorStack}` : ''}
Χρονοσήμανση: ${new Date().toLocaleString()}
URL: ${url}
`;
      
      navigator.clipboard.writeText(errorText);
      toast.success('Αντιγράφηκε στο πρόχειρο, επικολλήστε το στο chat');
    } catch (clipboardErr) {
      console.error('Αδυναμία αντιγραφής στο πρόχειρο:', clipboardErr);
    }
    
    // Αποστολή γεγονότος για να ενημερώσει το Lovable
    window.dispatchEvent(new CustomEvent('lovable-error', { detail: errorData }));
    
    return true;
  } catch (e) {
    console.error('Σφάλμα κατά την αποστολή σφάλματος στο chat:', e);
    return false;
  }
}
