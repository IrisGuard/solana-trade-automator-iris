
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'sonner';
import { Token } from '@/types/wallet';

// Επιλογή δικτύου - mainnet-beta για παραγωγή, devnet για δοκιμές
// Συνιστάται η χρήση ιδιωτικού RPC endpoint σε παραγωγή
const SOLANA_NETWORK = 'mainnet-beta';
const connection = new Connection(clusterApiUrl(SOLANA_NETWORK), 'confirmed');

// SPL Token Program ID - defined here to avoid dependency issues
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

// Επίσημες διευθύνσεις των πιο γνωστών tokens
const KNOWN_TOKEN_ADDRESSES: Record<string, { name: string, symbol: string, logo?: string }> = {
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': {
    name: 'USD Coin', 
    symbol: 'USDC',
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
  },
  '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R': {
    name: 'Raydium', 
    symbol: 'RAY',
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png'
  },
  'So11111111111111111111111111111111111111112': {
    name: 'Wrapped SOL',
    symbol: 'wSOL',
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
  },
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': {
    name: 'Marinade staked SOL',
    symbol: 'mSOL',
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png'
  },
};

export const solanaService = {
  // Σύνδεση με το Solana blockchain
  getConnection: () => connection,

  // Φόρτωση του υπολοίπου SOL του πορτοφολιού
  getSolBalance: async (address: string): Promise<number> => {
    try {
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL; // Μετατροπή από lamports σε SOL
    } catch (error) {
      console.error('Σφάλμα κατά τη λήψη του υπολοίπου SOL:', error);
      toast.error('Αποτυχία λήψης υπολοίπου SOL');
      return 0;
    }
  },

  // Φόρτωση όλων των tokens του πορτοφολιού
  getTokenAccounts: async (address: string): Promise<Token[]> => {
    try {
      const publicKey = new PublicKey(address);
      
      // Λήψη των λογαριασμών tokens του χρήστη
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      // Μετασχηματισμός των δεδομένων σε μορφή Token[]
      const tokens: Token[] = [];
      
      for (const { account } of tokenAccounts.value) {
        const parsedInfo = account.data.parsed.info;
        const mintAddress = parsedInfo.mint;
        const amount = parsedInfo.tokenAmount.uiAmount;
        
        // Αγνόηση των tokens με μηδενικό υπόλοιπο
        if (amount === 0) continue;
        
        // Εύρεση πληροφοριών για γνωστά tokens
        const knownToken = KNOWN_TOKEN_ADDRESSES[mintAddress];
        
        tokens.push({
          address: mintAddress,
          name: knownToken?.name || `Token ${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`,
          symbol: knownToken?.symbol || 'UNKNOWN',
          amount: amount,
          logo: knownToken?.logo
        });
      }

      // Προσθήκη του native SOL στη λίστα tokens
      const solBalance = await solanaService.getSolBalance(address);
      if (solBalance > 0) {
        tokens.unshift({
          address: 'So11111111111111111111111111111111111111112', // Συμβατική διεύθυνση για SOL
          name: 'Solana',
          symbol: 'SOL',
          amount: solBalance,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
        });
      }

      return tokens;
    } catch (error) {
      console.error('Σφάλμα κατά τη φόρτωση των tokens:', error);
      toast.error('Αποτυχία φόρτωσης των tokens');
      return [];
    }
  },

  // Λήψη των πρόσφατων συναλλαγών
  getRecentTransactions: async (address: string, limit = 10) => {
    try {
      const publicKey = new PublicKey(address);
      const transactions = await connection.getSignaturesForAddress(publicKey, {
        limit
      });

      return transactions.map(tx => ({
        signature: tx.signature,
        blockTime: tx.blockTime ? tx.blockTime * 1000 : Date.now(),
        status: tx.err ? 'αποτυχία' : 'επιβεβαιώθηκε',
        // Σημείωση: Για πλήρεις λεπτομέρειες συναλλαγών απαιτείται επιπλέον 
        // επεξεργασία των δεδομένων συναλλαγής με getTransaction
        type: 'Συναλλαγή',
        amount: '',
        from: '',
        to: ''
      }));
    } catch (error) {
      console.error('Σφάλμα κατά τη φόρτωση των συναλλαγών:', error);
      return [];
    }
  },
  
  // Λήψη της τρέχουσας τιμής ενός token (σε μια πραγματική υλοποίηση θα συνδεόταν με API τιμών)
  getTokenPrice: async (tokenAddress: string): Promise<number> => {
    // Προσομοίωση τιμών για γνωστά tokens
    const mockPrices: Record<string, number> = {
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 1.0, // USDC
      'So11111111111111111111111111111111111111112': 80.45, // SOL/wSOL
      '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R': 0.65, // RAY
      'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': 85.25, // mSOL
    };

    // Εδώ θα μπορούσαμε να συνδεθούμε με πραγματικό API τιμών όπως το CoinGecko
    return mockPrices[tokenAddress] || Math.random() * 10; // Προσομοίωση τυχαίας τιμής για άγνωστα tokens
  }
};

// Re-export types για συμβατότητα
export type { Token, Transaction } from '@/types/wallet';
