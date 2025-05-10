
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'sonner';
import { Token, Transaction } from '@/types/wallet';

// Ορίζουμε το TOKEN_PROGRAM_ID απευθείας ως PublicKey αντί να το εισάγουμε από @solana/spl-token
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

// Επιλογή δικτύου - mainnet-beta για παραγωγή, devnet για δοκιμές
// Συνιστάται η χρήση ιδιωτικού RPC endpoint σε παραγωγή
const SOLANA_NETWORK = 'mainnet-beta';
const connection = new Connection(clusterApiUrl(SOLANA_NETWORK), 'confirmed');

// Επίσημες διευθύνσεις των πιο γνωστών tokens
const KNOWN_TOKEN_ADDRESSES: Record<string, { name: string; symbol: string; logo?: string }> = {
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
  }
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
          address: 'So11111111111111111111111111111111111111112',
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
  
  // Λήψη των πρόσφατων συναλλαγών με περισσότερες λεπτομέρειες
  getRecentTransactions: async (address: string, limit = 10): Promise<Transaction[]> => {
    try {
      const publicKey = new PublicKey(address);
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit });
      
      const transactions: Transaction[] = [];
      
      for (const sig of signatures) {
        try {
          // Λήψη πλήρων πληροφοριών συναλλαγής
          const txInfo = await connection.getTransaction(sig.signature, {
            commitment: 'confirmed',
            maxSupportedTransactionVersion: 0
          });
          
          if (!txInfo) continue;
          
          let type = 'Συναλλαγή';
          let amount = '';
          let from = '';
          let to = '';
          
          // Προσπάθεια αναγνώρισης τύπου συναλλαγής και ποσού
          if (txInfo.meta && txInfo.meta.preTokenBalances && txInfo.meta.postTokenBalances) {
            // Πιθανή συναλλαγή token
            if (txInfo.meta.preTokenBalances.length > 0 || txInfo.meta.postTokenBalances.length > 0) {
              type = 'Token';
            }
          }
          
          // Έλεγχος για μεταφορά SOL
          if (txInfo.meta && txInfo.meta.preBalances && txInfo.meta.postBalances) {
            const preBalances = txInfo.meta.preBalances;
            const postBalances = txInfo.meta.postBalances;
            
            if (preBalances.length > 0 && postBalances.length > 0) {
              const accountIndex = txInfo.transaction.message.accountKeys.findIndex(
                key => key.pubkey.toBase58() === address
              );
              
              if (accountIndex >= 0) {
                const balanceDiff = (postBalances[accountIndex] - preBalances[accountIndex]) / LAMPORTS_PER_SOL;
                
                if (balanceDiff > 0) {
                  type = 'Κατάθεση';
                  amount = `+${balanceDiff.toFixed(5)} SOL`;
                } else if (balanceDiff < 0) {
                  type = 'Ανάληψη';
                  amount = `${balanceDiff.toFixed(5)} SOL`;
                }
              }
            }
          }
          
          transactions.push({
            signature: sig.signature,
            blockTime: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
            status: sig.err ? 'αποτυχία' : 'επιβεβαιώθηκε',
            type,
            amount,
            from,
            to
          });
        } catch (txError) {
          console.error('Σφάλμα ανάκτησης λεπτομερειών συναλλαγής:', txError);
          // Προσθήκη βασικών πληροφοριών αν η ανάκτηση λεπτομερειών αποτύχει
          transactions.push({
            signature: sig.signature,
            blockTime: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
            status: sig.err ? 'αποτυχία' : 'επιβεβαιώθηκε',
            type: 'Συναλλαγή'
          });
        }
      }
      
      return transactions;
    } catch (error) {
      console.error('Σφάλμα κατά τη φόρτωση των συναλλαγών:', error);
      return [];
    }
  },
  
  // Λήψη της τρέχουσας τιμής ενός token 
  getTokenPrice: async (tokenAddress: string): Promise<number> => {
    // Προσομοίωση τιμών για γνωστά tokens
    const mockPrices: Record<string, number> = {
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 1.0,
      'So11111111111111111111111111111111111111112': 80.45,
      '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R': 0.65,
      'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': 85.25
    };
    
    return mockPrices[tokenAddress] || Math.random() * 10;
  },
  
  // Αποστολή token σε άλλο πορτοφόλι (μελλοντική υλοποίηση)
  sendToken: async () => {
    // Θα υλοποιηθεί στο μέλλον
    toast.error('Η λειτουργία αποστολής token δεν έχει υλοποιηθεί ακόμα');
    return false;
  }
};
