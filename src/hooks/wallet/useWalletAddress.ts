
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { isPhantomInstalled, connectPhantomWallet, disconnectPhantomWallet } from '@/utils/phantomWallet';
import { handleWalletError } from '@/utils/walletUtils';
import { useErrorReporting } from '@/hooks/useErrorReporting';

/**
 * Hook to manage wallet connection state and actions
 */
export function useWalletAddress() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { reportError } = useErrorReporting();

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (isConnecting) {
      console.log("Connection already in progress, ignoring request");
      return false;
    }
    
    console.log("Initiating wallet connection...");
    try {
      setIsConnecting(true);
      setError(null);
      
      if (!isPhantomInstalled()) {
        console.log("Phantom wallet not installed");
        setError('Το Phantom wallet δεν είναι εγκατεστημένο');
        toast.error('Παρακαλώ εγκαταστήστε το Phantom wallet', {
          description: "Απαιτείται το Phantom Wallet για σύνδεση",
          duration: 5000
        });
        return false;
      }
      
      // Εμφάνιση toast για το αίτημα σύνδεσης
      toast.info("Αίτημα σύνδεσης στο Phantom Wallet...", {
        id: "phantom-connect-request",
        duration: 15000
      });
      
      console.log("Calling connectPhantomWallet...");
      const address = await connectPhantomWallet(false);
      
      if (address) {
        console.log("Connection successful:", address);
        setWalletAddress(address);
        setIsConnected(true);
        toast.success('Επιτυχής σύνδεση με το πορτοφόλι');
        toast.dismiss("phantom-connect-request");
        return true;
      } else {
        console.error("Connection returned null address");
        setError('Αποτυχία σύνδεσης πορτοφολιού');
        toast.error('Αποτυχία σύνδεσης με το πορτοφόλι');
        toast.dismiss("phantom-connect-request");
        return false;
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      const errorMessage = handleWalletError(err);
      setError(`Σφάλμα κατά τη σύνδεση πορτοφολιού: ${errorMessage}`);
      
      // Χρήση του errorReporting σε περίπτωση απροσδόκητων σφαλμάτων
      // αλλά όχι για περιπτώσεις που ο χρήστης απλά ακύρωσε τη σύνδεση
      if (!(err.code === 4001 || (err.message && err.message.includes('user rejected')))) {
        reportError(new Error(`Σφάλμα σύνδεσης wallet: ${errorMessage}`));
      }
      
      toast.error(`Σφάλμα σύνδεσης wallet: ${errorMessage}`);
      toast.dismiss("phantom-connect-request");
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, reportError]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    console.log("Initiating wallet disconnection...");
    try {
      const success = await disconnectPhantomWallet();
      
      if (success) {
        console.log("Disconnection successful");
        setWalletAddress('');
        setIsConnected(false);
        setError(null);
        toast.success('Το πορτοφόλι αποσυνδέθηκε');
        return true;
      } else {
        console.error("Disconnection failed");
        setError('Αποτυχία αποσύνδεσης πορτοφολιού');
        toast.error('Αποτυχία αποσύνδεσης πορτοφολιού');
        return false;
      }
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Σφάλμα κατά την αποσύνδεση πορτοφολιού: ${errorMessage}`);
      toast.error('Σφάλμα κατά την αποσύνδεση του πορτοφολιού');
      reportError(new Error(`Σφάλμα αποσύνδεσης wallet: ${errorMessage}`));
      return false;
    }
  }, [reportError]);

  return {
    isConnected,
    walletAddress,
    isConnecting,
    error,
    setError,
    connectWallet,
    disconnectWallet,
    setWalletAddress,
    setIsConnected,
  };
}
