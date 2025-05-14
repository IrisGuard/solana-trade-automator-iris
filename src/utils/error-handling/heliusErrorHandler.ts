
import { displayError } from "./displayError";
import { errorCollector } from "./collector";

/**
 * Ειδικός χειρισμός για σφάλματα του Helius API
 */
export function handleHeliusError(
  error: Error | unknown,
  context: {
    endpoint?: string;
    operation?: string;
    details?: any;
    component?: string;
  } = {}
) {
  const { endpoint, operation, details, component = 'HeliusService' } = context;
  
  // Μετατροπή του σφάλματος σε Error αν δεν είναι ήδη
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  // Προσδιορισμός του τύπου σφάλματος
  const errorMessage = errorObj.message.toLowerCase();
  const isRateLimit = errorMessage.includes('rate limit') || errorMessage.includes('too many requests');
  const isUnauthorized = errorMessage.includes('unauthorized') || errorMessage.includes('forbidden');
  const isInvalidParams = errorMessage.includes('invalid params');
  const isServerError = errorMessage.includes('internal server error');
  
  // Ανάλογα με τον τύπο σφάλματος, διαφορετική αντιμετώπιση
  if (isRateLimit) {
    // Ειδοποίηση για rate limit
    console.warn(`[Helius] Rate limit encountered: ${endpoint || operation}`);
    
    // Καταγραφή για ανάλυση
    errorCollector.captureError(errorObj, {
      component,
      details: JSON.stringify({
        ...details,
        errorType: 'rate_limit',
        endpoint,
        operation
      }),
      source: 'helius'
    });
    
    // Συμβάν που άλλα τμήματα της εφαρμογής μπορούν να ακούσουν
    const event = new CustomEvent('rate-limit-error', { 
      detail: { 
        errorType: 'rate-limit',
        message: 'Solana API rate limit exceeded',
        service: 'helius'
      } 
    });
    window.dispatchEvent(event);
    
    // Επιστρέφουμε το σφάλμα
    return errorObj;
  } 
  else if (isUnauthorized) {
    // Ειδοποίηση για μη εξουσιοδοτημένη πρόσβαση
    displayError(errorObj, {
      title: 'Σφάλμα Εξουσιοδότησης Helius',
      component,
      showToast: true,
      source: 'helius'
    });
  }
  else if (isInvalidParams) {
    // Καταγραφή σφάλματος παραμέτρων
    console.error(`[Helius] Invalid parameters for operation: ${operation || endpoint}`, details);
    
    // Απλό toast μόνο όταν είναι σε development mode
    if (process.env.NODE_ENV === 'development') {
      displayError(errorObj, {
        title: 'Άκυρες παράμετροι API',
        component,
        showToast: true,
        source: 'helius'
      });
    }
  }
  else if (isServerError) {
    // Καταγραφή εσωτερικού σφάλματος διακομιστή
    console.error(`[Helius] Internal server error: ${operation || endpoint}`);
    
    // Καταγραφή για ανάλυση
    errorCollector.captureError(errorObj, {
      component,
      details: JSON.stringify({
        ...details,
        errorType: 'server_error',
        endpoint,
        operation
      }),
      source: 'helius'
    });
    
    // Ειδοποίηση μόνο αν δεν έχουμε πολλά παρόμοια σφάλματα πρόσφατα
    displayError(errorObj, {
      title: 'Σφάλμα Helius Server',
      component,
      showToast: true,
      source: 'helius'
    });
  }
  else {
    // Γενικό σφάλμα
    console.error(`[Helius] Error: ${errorObj.message}`, details);
    
    // Καταγραφή για ανάλυση
    errorCollector.captureError(errorObj, {
      component,
      details: JSON.stringify({
        ...details,
        endpoint,
        operation
      }),
      source: 'helius'
    });
    
    // Γενικό μήνυμα σφάλματος
    displayError(errorObj, {
      title: 'Σφάλμα Helius API',
      component,
      showToast: true,
      source: 'helius'
    });
  }
  
  return errorObj;
}

/**
 * Χειρίζεται τις απαντήσεις JSON-RPC του Helius API
 */
export function handleHeliusResponse<T>(
  response: any, 
  context: {
    endpoint?: string;
    operation?: string;
    component?: string;
  } = {}
): T | null {
  // Έλεγχος για σφάλματα στην απάντηση JSON-RPC
  if (response && response.error) {
    // Δημιουργία σφάλματος από την απάντηση
    const error = new Error(response.error.message || response.error);
    
    // Χειρισμός του σφάλματος
    handleHeliusError(error, context);
    return null;
  }
  
  // Έλεγχος για null αποτέλεσμα
  if (response && response.result && response.result.value && 
      Array.isArray(response.result.value) && 
      response.result.value.every((v: any) => v === null)) {
    console.info(`[Helius] Received null result from ${context.operation || context.endpoint}`);
    return null;
  }
  
  // Επιστροφή των δεδομένων αν δεν υπάρχει σφάλμα
  return response && response.result ? 
    (response.result.value || response.result) : 
    (response || null);
}
