
import { toast } from 'sonner';

/**
 * Check if Phantom wallet is installed
 */
export const isPhantomInstalled = (): boolean => {
  return window?.phantom?.solana?.isPhantom || false;
};

/**
 * Try to connect to Phantom wallet (trusted connection)
 * - Modified to NOT auto-connect
 */
export const connectTrustedPhantomWallet = async (): Promise<string | null> => {
  // Don't auto-connect, just return null
  return null;
};

/**
 * Connect to Phantom wallet with user interaction
 */
export const connectPhantomWallet = async (): Promise<string | null> => {
  try {
    const phantom = window.phantom?.solana;

    if (!phantom) {
      const errorMsg = 'Το Phantom wallet δεν βρέθηκε! Παρακαλώ εγκαταστήστε το.';
      toast.error(errorMsg);
      return null;
    }

    toast.loading('Σύνδεση με το Phantom wallet...');
    
    const response = await phantom.connect();
    
    if (response && response.publicKey) {
      const address = response.publicKey.toString();
      console.log('Connected to wallet:', address);
      toast.success('Το πορτοφόλι συνδέθηκε επιτυχώς');
      return address;
    }
    return null;
  } catch (err: any) {
    console.error('Connection error:', err);
    const errorMsg = err.message || 'Αποτυχία σύνδεσης με το πορτοφόλι';
    toast.error(errorMsg);
    return null;
  } finally {
    toast.dismiss();
  }
};

/**
 * Disconnect from Phantom wallet
 */
export const disconnectPhantomWallet = async (): Promise<boolean> => {
  try {
    const phantom = window.phantom?.solana;
    
    if (phantom && phantom.isPhantom) {
      toast.loading('Αποσύνδεση πορτοφολιού...');
      await phantom.disconnect();
      toast.success('Το πορτοφόλι αποσυνδέθηκε');
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error disconnecting wallet:', err);
    toast.error('Αποτυχία αποσύνδεσης πορτοφολιού');
    return false;
  } finally {
    toast.dismiss();
  }
};
