
/**
 * Ελέγχει εάν το Phantom wallet είναι εγκατεστημένο στον browser
 * @returns boolean - true αν το Phantom είναι εγκατεστημένο
 */
export const checkPhantomWalletInstalled = (): boolean => {
  return window.phantom?.solana?.isPhantom || false;
};

/**
 * Διαχειρίζεται τα σφάλματα του Phantom wallet και επιστρέφει καταάλληλο μήνυμα σφάλματος
 * @param err - Το αντικείμενο σφάλματος που επιστρέφεται από το Phantom
 * @returns string - Το μήνυμα σφάλματος που θα εμφανιστεί στο χρήστη
 */
export const handleWalletError = (err: any): string => {
  console.error('Wallet error details:', err);

  // Αναλυτικός έλεγχος για συγκεκριμένους κωδικούς σφάλματος του Phantom
  if (err.code) {
    // Κωδικοί σφάλματος από το Phantom API
    switch (err.code) {
      case 4001:
        return 'Ακυρώθηκε από το χρήστη';
      case 4900:
      case -32000:
        return 'Το Phantom wallet είναι κλειδωμένο. Παρακαλώ ξεκλειδώστε το και δοκιμάστε ξανά';
      case 4100:
        return 'Μη εξουσιοδοτημένο αίτημα σύνδεσης';
      case 4200:
        return 'Το wallet δεν ανταποκρίνεται. Δοκιμάστε να ανανεώσετε τη σελίδα';
      case 4300:
        return 'Ο χρήστης απέρριψε το αίτημα υπογραφής';
      case -32603:
        return 'Εσωτερικό σφάλμα του wallet. Δοκιμάστε να επανεκκινήσετε το wallet';
      case -32002:
        return 'Ήδη εκκρεμεί αίτημα σύνδεσης. Ελέγξτε το παράθυρο του wallet';
      case -32601:
        return 'Η ζητούμενη λειτουργία δεν υποστηρίζεται';
      case -32005:
        return 'Αίτημα εκτός εύρους. Δοκιμάστε ξανά με διαφορετικές παραμέτρους';
    }
  }

  // Έλεγχος για συγκεκριμένα μηνύματα σφάλματος
  if (err.message) {
    if (err.message.includes('not installed')) {
      return 'Το Phantom Wallet δεν είναι εγκατεστημένο';
    }
    if (err.message.includes('user rejected')) {
      return 'Ο χρήστης απέρριψε το αίτημα σύνδεσης';
    }
    if (err.message.includes('timeout')) {
      return 'Λήξη χρόνου αναμονής για απάντηση από το wallet';
    }
    if (err.message.includes('locked')) {
      return 'Το wallet είναι κλειδωμένο. Παρακαλώ ξεκλειδώστε το πρώτα';
    }
    
    // Επιστρέφουμε το αρχικό μήνυμα σφάλματος αν υπάρχει και δεν αναγνωρίζεται
    return err.message;
  }

  // Γενικό μήνυμα σφάλματος αν δεν μπορούμε να αναγνωρίσουμε την αιτία
  return 'Προέκυψε απρόσμενο σφάλμα κατά την επικοινωνία με το wallet';
};

/**
 * Μορφοποιεί μια διεύθυνση πορτοφολιού για εμφάνιση
 * @param address - Η πλήρης διεύθυνση του πορτοφολιού
 * @returns string - Η συντομευμένη διεύθυνση (π.χ. Nj7G...8Xtp)
 */
export const formatWalletAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
};

/**
 * Ελέγχει αν το wallet είναι συνδεδεμένο μέσω του Phantom API
 * @returns Promise<boolean> - true αν το wallet είναι συνδεδεμένο
 */
export const isWalletConnected = async (): Promise<boolean> => {
  try {
    if (!window.phantom?.solana) return false;
    
    // Προσπαθούμε να συνδεθούμε μόνο αν είναι ήδη έμπιστο
    const response = await window.phantom.solana.connect({ onlyIfTrusted: true })
      .catch(() => null);
    
    return !!response;
  } catch (error) {
    console.error("Error checking wallet connection:", error);
    return false;
  }
};

/**
 * Ασφαλής μέθοδος για αποσύνδεση του wallet
 * @returns Promise<boolean> - true αν η αποσύνδεση ήταν επιτυχής
 */
export const safeDisconnectWallet = async (): Promise<boolean> => {
  try {
    if (!window.phantom?.solana) return false;
    
    await window.phantom.solana.disconnect();
    return true;
  } catch (error) {
    console.error("Error disconnecting wallet:", error);
    return false;
  }
};
