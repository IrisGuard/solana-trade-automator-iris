import { useState, useCallback, useRef } from '../../react-runtime';
import { toast } from 'sonner';
import { getSolBalance } from '@/services/solana/wallet';
import { useErrorReporting } from '@/hooks/useErrorReporting';

/**
 * Hook για τη διαχείριση του SOL balance του wallet
 */
export function useWalletBalance() {
  // Αρχικοποίηση state εκτός της διαδρομής render
  const [solBalance, setSolBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { reportError } = useErrorReporting();
  
  // Θα παρακολουθούμε τον χρόνο του τελευταίου αιτήματος
  const lastBalanceRequest = useRef(0);
  
  // Ελάχιστο διάστημα μεταξύ διαδοχικών αιτημάτων (10 δευτ)
  const MIN_REQUEST_INTERVAL = 10000;

  // Φόρτωση SOL balance
  const loadSolBalance = useCallback(async (address: string) => {
    if (!address) return 0;
    
    const now = Date.now();
    // Έλεγχος αν έχει περάσει αρκετός χρόνος από το τελευταίο αίτημα
    if (now - lastBalanceRequest.current < MIN_REQUEST_INTERVAL) {
      console.log("Throttling balance request, using existing balance");
      return solBalance;
    }
    
    lastBalanceRequest.current = now;
    console.log("Loading SOL balance for address:", address);
    
    if (isLoading) {
      console.log("Balance loading already in progress, skipping duplicate request");
      return solBalance;
    }
    
    setIsLoading(true);
    
    try {
      const balance = await getSolBalance(address);
      setSolBalance(balance);
      console.log("SOL balance loaded:", balance);
      return balance;
    } catch (err) {
      console.error('Error loading SOL balance:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      // Αποφεύγουμε να εμφανίζουμε πολλά toast μηνύματα για σφάλματα balance
      if (!errorMessage.includes('rate limit') && !errorMessage.includes('Παραλείπεται το αίτημα')) {
        toast.error('Αποτυχία φόρτωσης υπολοίπου SOL', {
          id: 'sol-balance-load-error'
        });
      }
      
      reportError(new Error(`Σφάλμα φόρτωσης υπολοίπου SOL: ${errorMessage}`));
      return solBalance; // Επιστρέφουμε την τρέχουσα τιμή
    } finally {
      setIsLoading(false);
    }
  }, [reportError, solBalance, isLoading]);

  return {
    solBalance,
    isLoading,
    loadSolBalance
  };
}
