
// Interface για το Phantom Wallet
export interface PhantomWindow extends Window {
  phantom?: {
    solana?: {
      isPhantom: boolean;
      connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<any>;
      disconnect: () => Promise<void>;
      on: (event: string, callback: Function) => void;
      off: (event: string, callback: Function) => void;
      request: (method: string, params: any) => Promise<any>;
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
    const error = new Error('Το Phantom wallet δεν βρέθηκε! Παρακαλώ εγκαταστήστε το.');
    console.error(error);
    throw error;
  }
  
  try {
    console.log(`Attempting to connect to Phantom (onlyIfTrusted: ${onlyIfTrusted})`);
    const { publicKey } = await win.phantom.solana.connect({ onlyIfTrusted });
    console.log("Connected to Phantom wallet successfully:", publicKey.toString());
    return publicKey.toString();
  } catch (err) {
    console.error('Σφάλμα κατά τη σύνδεση με το Phantom Wallet:', err);
    // Αναπροωθούμε το σφάλμα ώστε να μπορεί να το χειριστεί ο καλών
    throw err;
  }
};

// Σύνδεση μόνο με trusted Phantom Wallet (για αυτόματη σύνδεση)
export const connectTrustedPhantomWallet = async (): Promise<string | null> => {
  try {
    return await connectPhantomWallet(true);
  } catch (err) {
    // Για τα trusted wallets, αγνοούμε τα σφάλματα και επιστρέφουμε null
    // καθώς αυτό είναι αναμενόμενο για μη-trusted wallets
    console.log("Not connected to a trusted wallet:", err);
    return null;
  }
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
    throw err;
  }
};

// Εγγραφή για λήψη γεγονότων από το Phantom Wallet
export const registerPhantomEvents = (
  onConnect?: (publicKey: string) => void,
  onDisconnect?: () => void
): (() => void) => {
  const win = window as unknown as PhantomWindow;
  
  if (!win.phantom?.solana) {
    return () => {}; // Κενή συνάρτηση καθαρισμού αν δεν υπάρχει το Phantom
  }
  
  // Χειριστής γεγονότων για σύνδεση
  const handleConnect = (publicKey: string) => {
    console.log("Phantom event: connected", publicKey);
    if (onConnect) onConnect(publicKey);
  };
  
  // Χειριστής γεγονότων για αποσύνδεση
  const handleDisconnect = () => {
    console.log("Phantom event: disconnected");
    if (onDisconnect) onDisconnect();
  };
  
  // Προσθήκη των χειριστών γεγονότων
  win.phantom.solana.on('connect', handleConnect);
  win.phantom.solana.on('disconnect', handleDisconnect);
  
  // Επιστροφή συνάρτησης καθαρισμού
  return () => {
    win.phantom.solana.off('connect', handleConnect);
    win.phantom.solana.off('disconnect', handleDisconnect);
  };
};
