
import { PublicKey } from '@solana/web3.js';
import { connection, TOKEN_PROGRAM_ID, KNOWN_TOKEN_ADDRESSES } from '../config';
import { Token } from './types';
import { fetchSOLBalance } from '../wallet/balance';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';
import { withRateLimitRetry, isRateLimitError } from '@/utils/error-handling/rateLimitHandler';

// Cache για token balances που θα χρησιμοποιηθεί ως fallback όταν το API έχει rate limit
const tokenBalanceCache: Record<string, { tokens: Token[], timestamp: number }> = {};

// Χρονικό διάστημα εγκυρότητας του cache (5 λεπτά)
const CACHE_VALIDITY_PERIOD = 5 * 60 * 1000;

// Έλεγχος αν το cache είναι ακόμα έγκυρο
function isCacheValid(address: string): boolean {
  const cachedData = tokenBalanceCache[address];
  if (!cachedData) return false;
  
  const now = Date.now();
  return (now - cachedData.timestamp) < CACHE_VALIDITY_PERIOD;
}

// Get token balance για ένα συγκεκριμένο token και wallet
export const fetchTokenBalance = async (tokenAddress: string, walletAddress: string): Promise<number> => {
  try {
    return await withRateLimitRetry(async () => {
      // Implementation for getting balance of a specific token
      // Αυτό είναι ένα placeholder, η πραγματική υλοποίηση θα εξαρτηθεί από τις συγκεκριμένες απαιτήσεις
      return 0;
    }, { endpoint: `token-balance-${tokenAddress.substring(0, 8)}` });
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return 0;
  }
};

// Λήψη όλων των token balances για ένα wallet
export const fetchAllTokenBalances = async (address: string): Promise<Token[]> => {
  // Πρώτα ελέγχουμε αν έχουμε έγκυρο cache για να αποφύγουμε άσκοπα API calls
  if (isCacheValid(address)) {
    console.log('Using cached token balances for', address);
    return tokenBalanceCache[address].tokens;
  }
  
  try {
    return await withRateLimitRetry(async () => {
      const publicKey = new PublicKey(address);
      
      // Λήψη των token accounts του χρήστη
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      // Μετατροπή δεδομένων σε Token[]
      const tokens: Token[] = [];
      
      for (const { account } of tokenAccounts.value) {
        const parsedInfo = account.data.parsed.info;
        const mintAddress = parsedInfo.mint;
        const amount = parsedInfo.tokenAmount.uiAmount;
        
        // Παραλείπουμε tokens με μηδενικό balance
        if (amount === 0) continue;
        
        // Βρίσκουμε πληροφορίες για γνωστά tokens
        const knownToken = KNOWN_TOKEN_ADDRESSES[mintAddress];
        
        tokens.push({
          address: mintAddress,
          name: knownToken?.name || `Token ${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`,
          symbol: knownToken?.symbol || 'UNKNOWN',
          amount: amount,
          logo: knownToken?.logo
        });
      }
      
      try {
        // Προσθήκη native SOL στη λίστα token - χειριζόμαστε τα σφάλματα ξεχωριστά
        const solBalance = await fetchSOLBalance(address);
        if (solBalance > 0) {
          tokens.unshift({
            address: 'So11111111111111111111111111111111111111112',
            name: 'Solana',
            symbol: 'SOL',
            amount: solBalance,
            logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
          });
        }
      } catch (solError) {
        console.log('Could not add SOL balance to tokens list:', solError);
        // Συνεχίζουμε χωρίς SOL balance
      }
      
      // Αποθήκευση στο cache με χρονοσήμανση
      tokenBalanceCache[address] = { 
        tokens: [...tokens],
        timestamp: Date.now() 
      };
      
      return tokens;
    }, { endpoint: `token-accounts-${address.substring(0, 8)}` });
  } catch (error) {
    // Έλεγχος για rate limit errors
    if (isRateLimitError(error)) {
      console.warn('Rate limit encountered when fetching tokens, using cached data if available');
      
      // Χρήση cached data αν υπάρχει, ακόμη κι αν δεν είναι εντελώς έγκυρο
      if (address in tokenBalanceCache) {
        console.log('Using cached token data due to API rate limits');
        return tokenBalanceCache[address].tokens;
      }
      
      // Το μήνυμα toast έχει ήδη εμφανιστεί από τη συνάρτηση withRateLimitRetry
    } else {
      // Άλλα σφάλματα
      console.error('Error loading tokens:', error);
      toast.error('Failed to load tokens', {
        id: 'tokens-load-error'
      });
    }
    
    // Προσθήκη στο error collector
    errorCollector.addError({
      message: 'Failed to load tokens',
      source: 'client',
      stack: String(error),
      details: { address }
    });
    
    // Επιστροφή κενού array ή cached δεδομένων αν υπάρχουν
    return address in tokenBalanceCache ? tokenBalanceCache[address].tokens : [];
  }
};

