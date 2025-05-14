
import { Connection, PublicKey } from '@solana/web3.js';
import { Token } from '@/types/wallet';

// Τυχαία tokens (για δοκιμαστικούς σκοπούς)
const DEMO_TOKENS: Token[] = [
  { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', name: 'USD Coin', decimals: 6, balance: 2500, uiBalance: 2.5, amount: 2500, mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
  { address: 'So11111111111111111111111111111111111111112', symbol: 'SOL', name: 'Solana', decimals: 9, balance: 5000000000, uiBalance: 5, amount: 5000000000, mint: 'So11111111111111111111111111111111111111112' },
  { address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', symbol: 'USDT', name: 'Tether USD', decimals: 6, balance: 1000, uiBalance: 1, amount: 1000, mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' },
];

/**
 * Service για τη διαχείριση των tokens στο Solana blockchain
 */
export const tokenService = {
  // Φέρε όλα τα tokens για μια διεύθυνση wallet
  async fetchTokens(walletAddress: string): Promise<Token[]> {
    // Σε παραγωγικό περιβάλλον, εδώ θα κάναμε πραγματική κλήση API
    // αλλά για demo σκοπούς επιστρέφουμε τα δοκιμαστικά δεδομένα

    console.log(`Fetching tokens for wallet: ${walletAddress}`);
    
    // Επιστροφή των demo tokens
    return DEMO_TOKENS;
  },

  // Φέρε τιμές για τα tokens
  async fetchTokenPrices(tokenAddresses: string[]): Promise<Record<string, { price: number, priceChange24h: number }>> {
    console.log(`Fetching prices for tokens: ${tokenAddresses.join(', ')}`);
    
    // Mock data για τιμές tokens
    const prices: Record<string, { price: number, priceChange24h: number }> = {};
    
    // Δημιουργία τυχαίων τιμών για κάθε token
    tokenAddresses.forEach(address => {
      prices[address] = {
        price: Math.random() * 100,
        priceChange24h: (Math.random() * 20) - 10
      };
    });
    
    return prices;
  }
};
