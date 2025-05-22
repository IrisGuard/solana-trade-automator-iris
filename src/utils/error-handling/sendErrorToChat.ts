
/**
 * Αποστολή σφάλματος στο chat για ανάλυση
 */
export function sendErrorToChat(error: Error | string, additionalInfo?: any): void {
  try {
    // Μετατροπή string σε Error αν χρειάζεται
    const errorObject = typeof error === 'string' ? new Error(error) : error;
    
    // Δημιουργία αντικειμένου δεδομένων για το chat
    const errorData = {
      type: 'error',
      message: errorObject.message,
      stack: errorObject.stack,
      additionalInfo,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };
    
    // Αποθήκευση στο localStorage για το Lovable Chat
    try {
      const storedErrors = JSON.parse(localStorage.getItem('lovable_chat_errors') || '[]');
      storedErrors.push(errorData);
      localStorage.setItem('lovable_chat_errors', JSON.stringify(storedErrors));
    } catch (e) {
      console.error("Error storing error for chat:", e);
    }
    
    // Αποστολή custom event για να ενημερώσει το Lovable Chat
    try {
      const event = new CustomEvent('lovable-error', { detail: errorData });
      window.dispatchEvent(event);
      
      console.log('Error sent to chat successfully');
    } catch (e) {
      console.error('Failed to dispatch error event to chat:', e);
    }
    
  } catch (e) {
    console.error("Error in sendErrorToChat:", e);
  }
}
