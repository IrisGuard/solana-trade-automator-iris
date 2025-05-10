
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
  console.error('Wallet error:', err);

  // Έλεγχος για συγκεκριμένους κωδικούς σφάλματος του Phantom
  if (err.code === 4001) {
    return 'Ο χρήστης απέρριψε το αίτημα σύνδεσης.';
  }
  
  if (err.code === 4900) {
    return 'Το Phantom wallet είναι κλειδωμένο. Παρακαλώ ξεκλειδώστε το.';
  }

  if (err.message) {
    return `Σφάλμα: ${err.message}`;
  }

  return 'Προέκυψε απρόσμενο σφάλμα κατά την επικοινωνία με το πορτοφόλι.';
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
 * Ορισμός των τύπων για το Phantom wallet
 */
declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom: boolean;
        connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<any>;
        disconnect: () => Promise<void>;
        on: (event: string, callback: Function) => void;
        off: (event: string, callback: Function) => void;
      };
    };
  }
}
