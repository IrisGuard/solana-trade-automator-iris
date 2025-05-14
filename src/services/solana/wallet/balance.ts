
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'sonner';
import { connection } from '../config';
import { errorCollector } from '@/utils/error-handling/collector';
import { withRateLimitRetry, isRateLimitError } from '@/utils/error-handling/rateLimitHandler';

// Cache για τα SOL balances που θα χρησιμοποιηθεί ως fallback όταν το API έχει rate limit
const solBalanceCache: Record<string, { balance: number, timestamp: number }> = {};

// Χρονικό διάστημα εγκυρότητας του cache (5 λεπτά)
const CACHE_VALIDITY_PERIOD = 5 * 60 * 1000;

// Έλεγχος αν το cache είναι ακόμα έγκυρο
function isCacheValid(address: string): boolean {
  const cachedData = solBalanceCache[address];
  if (!cachedData) return false;
  
  const now = Date.now();
  return (now - cachedData.timestamp) < CACHE_VALIDITY_PERIOD;
}

// Fetch SOL balance για ένα wallet address
export const fetchSOLBalance = async (address: string): Promise<number> => {
  // Αν έχουμε έγκυρο cache, επιστρέφουμε το από εκεί για να αποφύγουμε άσκοπα API calls
  if (isCacheValid(address)) {
    console.log('Using cached SOL balance for', address);
    return solBalanceCache[address].balance;
  }
  
  try {
    return await withRateLimitRetry(async () => {
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;
      
      // Αποθήκευση στο cache με χρονοσήμανση
      solBalanceCache[address] = { 
        balance: solBalance, 
        timestamp: Date.now() 
      };
      
      return solBalance;
    }, { endpoint: `sol-balance-${address.substring(0, 8)}` });
  } catch (error) {
    // Έλεγχος για rate limit errors
    if (isRateLimitError(error)) {
      console.warn('Rate limit encountered when fetching SOL balance, using cached data if available');
      
      // Χρήση cached balance αν υπάρχει, ακόμη κι αν δεν είναι εντελώς έγκυρο
      if (address in solBalanceCache) {
        console.log('Using cached SOL balance due to API rate limits');
        return solBalanceCache[address].balance;
      }
      
      // Αποφεύγουμε να εμφανίζουμε πολλά toast μηνύματα
      // Το withRateLimitRetry έχει ήδη εμφανίσει σχετικό μήνυμα
    } else {
      // Γενικό σφάλμα για άλλες περιπτώσεις
      console.error('Error getting SOL balance:', error);
      toast.error('Failed to get SOL balance', {
        id: 'sol-balance-error' // Unique ID για να αποφύγουμε διπλά μηνύματα
      });
    }
    
    // Προσθήκη στο error collector για περαιτέρω ανάλυση
    errorCollector.captureError('Failed to get SOL balance', {
      component: 'wallet.balance',
      source: 'client',
      details: { address, error: String(error) }
    });
    
    // Επιστροφή 0 ή cached τιμής αν υπάρχει (ακόμη κι αν δεν είναι έγκυρη)
    return address in solBalanceCache ? solBalanceCache[address].balance : 0;
  }
};
