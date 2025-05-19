
/**
 * Configuration for Helius API service
 */

// Add a fallback key config - όχι hardcoded κλειδί για ασφάλεια
export const FALLBACK_HELIUS_KEY = null; // Δεν χρησιμοποιούμε hardcoded κλειδιά - θα φορτωθούν από τη βάση δεδομένων

// Base URL for Helius API
export const HELIUS_API_BASE_URL = 'https://api.helius.xyz/v0';

// Function to get Helius API key - παρωχημένη, χρησιμοποιήστε HeliusKeyManager
export const getHeliusApiKey = (): string | null => {
  // Προσπάθεια ανάκτησης κλειδιού από το localStorage
  try {
    const storedKey = localStorage.getItem('api_key_helius');
    if (storedKey) {
      const parsedKey = JSON.parse(storedKey);
      return parsedKey.key;
    }
  } catch (error) {
    console.error('Σφάλμα ανάκτησης κλειδιού Helius:', error);
  }
  
  // Επιστροφή null αν δεν βρέθηκε έγκυρο κλειδί
  return FALLBACK_HELIUS_KEY;
};
