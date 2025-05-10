
import { toast } from 'sonner';

// Βοηθητική συνάρτηση για έλεγχο αν το Phantom είναι εγκατεστημένο
export const checkPhantomWalletInstalled = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.phantom?.solana && window.phantom.solana.isPhantom;
};

// Βοηθητική συνάρτηση για μορφοποίηση της διεύθυνσης πορτοφολιού για εμφάνιση
export const formatWalletAddress = (address: string | null): string => {
  if (!address) return '';
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
};

// Βοηθητική συνάρτηση για χειρισμό σφαλμάτων σύνδεσης
export const handleWalletError = (err: unknown): string => {
  console.error('Error connecting wallet:', err);
  let errorMsg = 'Αποτυχία σύνδεσης πορτοφολιού';
  
  if (err instanceof Error) {
    // Χειρισμός συγκεκριμένων τύπων σφαλμάτων
    if (err.message.includes('User rejected')) {
      errorMsg = 'Η σύνδεση απορρίφθηκε από τον χρήστη';
    } else if (err.message.includes('timeout')) {
      errorMsg = 'Η σύνδεση έληξε. Παρακαλώ δοκιμάστε ξανά';
    } else {
      errorMsg += `: ${err.message}`;
    }
  }
  
  toast.error(errorMsg);
  return errorMsg;
};
