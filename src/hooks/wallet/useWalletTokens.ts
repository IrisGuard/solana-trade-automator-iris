
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Token } from '@/types/wallet';
import { fetchAllTokenBalances } from '@/services/solana/token';
import { fetchTokenPrices } from '@/services/solana/price';
import { useErrorReporting } from '@/hooks/useErrorReporting';

/**
 * Hook για τη διαχείριση των δεδομένων tokens του wallet
 */
export function useWalletTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false);
  const { reportError } = useErrorReporting();
  
  // Θα παρακολουθούμε τον χρόνο του τελευταίου αιτήματος
  const lastTokensRequest = useRef<number>(0);
  
  // Ελάχιστο διάστημα μεταξύ διαδοχικών αιτημάτων (10 δευτ)
  const MIN_REQUEST_INTERVAL = 10000;

  // Φόρτωση tokens wallet
  const loadWalletTokens = useCallback(async (address: string) => {
    if (!address) return;
    
    const now = Date.now();
    // Έλεγχος αν έχει περάσει αρκετός χρόνος από το τελευταίο αίτημα
    if (now - lastTokensRequest.current < MIN_REQUEST_INTERVAL) {
      console.log("Throttling tokens request, using existing tokens");
      return tokens;
    }
    
    lastTokensRequest.current = now;
    console.log("Loading tokens for address:", address);
    
    if (isLoadingTokens) {
      console.log("Tokens loading already in progress, skipping duplicate request");
      return tokens;
    }
    
    setIsLoadingTokens(true);
    
    try {
      const userTokens = await fetchAllTokenBalances(address);
      setTokens(userTokens);
      console.log(`Loaded ${userTokens.length} tokens`);
      
      if (userTokens.length > 0) {
        const tokenAddresses = userTokens.map(token => token.address);
        try {
          const priceData = await fetchTokenPrices(tokenAddresses);
          
          // Μετατροπή του TokenPriceData σε απλό price record
          const simplePrices: Record<string, number> = {};
          
          // Ασφαλής εξαγωγή τιμών
          Object.entries(priceData).forEach(([address, data]) => {
            if (data && typeof data === 'object' && 'price' in data) {
              simplePrices[address] = data.price;
            }
          });
          
          setTokenPrices(simplePrices);
          console.log("Token prices loaded for", Object.keys(simplePrices).length, "tokens");
        } catch (priceError) {
          console.error('Error loading token prices:', priceError);
          // Συνεχίζουμε χωρίς τιμές, δεν είναι κρίσιμο σφάλμα
        }
      }
      
      return userTokens;
    } catch (err) {
      console.error('Error loading wallet tokens:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      // Αποφεύγουμε να εμφανίζουμε πολλά toast μηνύματα για σφάλματα tokens
      if (!errorMessage.includes('rate limit') && !errorMessage.includes('Παραλείπεται το αίτημα')) {
        toast.error('Αποτυχία φόρτωσης tokens', {
          id: 'tokens-load-error'
        });
      }
      
      reportError(new Error(`Σφάλμα φόρτωσης tokens: ${errorMessage}`));
      return tokens; // Επιστρέφουμε τα υπάρχοντα tokens
    } finally {
      setIsLoadingTokens(false);
    }
  }, [reportError, tokens, isLoadingTokens]);

  // Επιλογή token για trading
  const selectTokenForTrading = useCallback((tokenAddress: string) => {
    const token = tokens.find(t => t.address === tokenAddress);
    if (token) {
      toast.success(`Επιλέχθηκε το ${token.symbol} για trading`);
      return token;
    }
    return null;
  }, [tokens]);

  return {
    tokens,
    tokenPrices,
    isLoadingTokens,
    loadWalletTokens,
    selectTokenForTrading
  };
}

