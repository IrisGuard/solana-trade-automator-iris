
// Interface για το Phantom Wallet
export interface PhantomWindow extends Window {
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

// Έλεγχος αν το Phantom είναι εγκατεστημένο
export const isPhantomInstalled = (): boolean => {
  try {
    const win = window as unknown as PhantomWindow;
    return win?.phantom?.solana?.isPhantom || false;
  } catch (err) {
    console.error('Error checking if Phantom is installed:', err);
    return false;
  }
};

// Σύνδεση με το Phantom Wallet
export const connectPhantomWallet = async (onlyIfTrusted = false): Promise<string | null> => {
  const win = window as unknown as PhantomWindow;
  
  if (!win.phantom?.solana) {
    alert('Το Phantom wallet δεν βρέθηκε! Παρακαλώ εγκαταστήστε το.');
    return null;
  }
  
  try {
    const { publicKey } = await win.phantom.solana.connect({ onlyIfTrusted });
    return publicKey.toString();
  } catch (err) {
    console.error('Σφάλμα κατά τη σύνδεση με το Phantom Wallet:', err);
    return null;
  }
};

// Σύνδεση μόνο με trusted Phantom Wallet (για αυτόματη σύνδεση)
export const connectTrustedPhantomWallet = async (): Promise<string | null> => {
  return connectPhantomWallet(true);
};

// Αποσύνδεση από το Phantom Wallet
export const disconnectPhantomWallet = async (): Promise<boolean> => {
  const win = window as unknown as PhantomWindow;
  
  if (!win.phantom?.solana) {
    return false;
  }
  
  try {
    await win.phantom.solana.disconnect();
    return true;
  } catch (err) {
    console.error('Σφάλμα κατά την αποσύνδεση από το Phantom Wallet:', err);
    return false;
  }
};
