
import { useState, useCallback } from 'react';
import { useErrorReporting } from '@/hooks/useErrorReporting';
import { solanaService } from '@/services/solana';
import { Token } from '@/types/wallet';
import { TokenPrice } from '@/services/solana/token/types';

/**
 * Hook for fetching and managing wallet data
 */
export function useWalletData() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenPrices, setTokenPrices] = useState<Record<string, TokenPrice>>({});
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false);
  const [solBalance, setSolBalance] = useState<number>(0);
  
  const { reportError } = useErrorReporting();
  
  // Load token data for a wallet address
  const loadWalletData = useCallback(async (walletAddress: string) => {
    if (!walletAddress) {
      console.log("Δεν υπάρχει διεύθυνση πορτοφολιού για φόρτωση δεδομένων");
      return;
    }
    
    setIsLoadingTokens(true);
    
    try {
      console.log('Φόρτωση δεδομένων πορτοφολιού για διεύθυνση:', walletAddress);
      
      // Get SOL balance
      try {
        console.log("Λήψη υπολοίπου SOL...");
        const balance = await solanaService.fetchSOLBalance(walletAddress);
        console.log('Ελήφθη υπόλοιπο SOL:', balance);
        setSolBalance(balance);
      } catch (balanceError) {
        console.error('Σφάλμα λήψης υπολοίπου SOL:', balanceError);
        reportError(balanceError);
      }
      
      // Get token data - This would be implemented in the real app
      // Here we're just using mock data for demonstration
      // In the real application this would call solanaService.fetchTokens() or similar
      
      // Simulate token data for now
      const mockTokens = [
        { 
          address: 'So11111111111111111111111111111111111111112', 
          symbol: 'SOL', 
          name: 'Solana', 
          amount: solBalance, 
          decimals: 9,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
        },
        { 
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 
          symbol: 'USDC', 
          name: 'USD Coin', 
          amount: 150.25, 
          decimals: 6,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
        }
      ];
      
      setTokens(mockTokens);
      
      // Simulate token prices
      const mockPrices: Record<string, TokenPrice> = {
        'So11111111111111111111111111111111111111112': { 
          price: 100, 
          priceChange24h: 2.5 
        },
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': { 
          price: 1, 
          priceChange24h: 0 
        }
      };
      
      setTokenPrices(mockPrices);
      
      console.log("Η φόρτωση δεδομένων πορτοφολιού ολοκληρώθηκε");
    } catch (err: any) {
      console.error('Σφάλμα φόρτωσης δεδομένων πορτοφολιού:', err);
      reportError(err);
    } finally {
      setIsLoadingTokens(false);
    }
  }, [reportError]);
  
  // Select token for trading
  const selectTokenForTrading = useCallback((tokenAddress: string): Token | null => {
    console.log("Επιλογή token για συναλλαγή:", tokenAddress);
    const selectedToken = tokens.find(token => token.address === tokenAddress);
    return selectedToken || null;
    // This now returns a Token or null, matching the expected return type
  }, [tokens]);
  
  return {
    tokens,
    tokenPrices,
    isLoadingTokens,
    solBalance,
    loadWalletData,
    selectTokenForTrading
  };
}
