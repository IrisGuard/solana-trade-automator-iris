
import { useLanguage } from '@/hooks/use-language';

// Το αρχείο αυτό υπάρχει μόνο για συμβατότητα με παλιότερο κώδικα
// Προτιμήστε να χρησιμοποιείτε το useLanguage() hook αντί για αυτή τη συνάρτηση
export const t = (key: string): string => {
  console.warn('Deprecated: The direct t() function is deprecated. Please use useLanguage() hook instead');
  
  // Δημιουργούμε μια απλή λύση που να λειτουργεί μέχρι να γίνει η μετάβαση
  try {
    // Παλιός τρόπος
    const translations = {
      'sidebar.dashboard': 'Πίνακας Ελέγχου',
      'sidebar.wallet': 'Πορτοφόλι',
      'sidebar.transactions': 'Συναλλαγές',
      'sidebar.bots': 'Bots',
      'sidebar.api_vault': 'Θησαυροφυλάκιο API',
    };
    
    return translations[key as keyof typeof translations] || key;
  } catch (e) {
    return key;
  }
};
