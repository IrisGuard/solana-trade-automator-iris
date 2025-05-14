
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { errorCollector } from '@/utils/error-handling/collector';
import { RPC_ENDPOINTS } from '../config';

/**
 * Λαμβάνει το SOL balance από ένα πορτοφόλι
 * 
 * @param address Η διεύθυνση του πορτοφολιού
 * @returns Το balance σε SOL (όχι σε lamports)
 */
export async function getSolBalance(address: string): Promise<number> {
  try {
    // Έλεγχος αν έχουμε έγκυρη διεύθυνση
    if (!address) {
      throw new Error("No wallet address provided");
    }
    
    // Προσπάθεια σύνδεσης με το RPC endpoint
    const connection = new Connection(RPC_ENDPOINTS.PRIMARY);
    
    // Μετατροπή της διεύθυνσης σε PublicKey
    let pubkey: PublicKey;
    try {
      pubkey = new PublicKey(address);
    } catch (err) {
      throw new Error(`Invalid wallet address: ${address}`);
    }

    // Λήψη του balance σε lamports
    const lamports = await connection.getBalance(pubkey);
    
    // Μετατροπή από lamports σε SOL
    const solBalance = lamports / LAMPORTS_PER_SOL;
    
    // Επιστροφή του balance
    return solBalance;
  } catch (error) {
    // Καταγραφή του σφάλματος
    console.error(`Error getting SOL balance for ${address}:`, error);
    
    // Καταγραφή στον collector
    errorCollector.reportError(error as Error, 'WalletBalance', {
      address: address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 'unknown'
    });
    
    // Επιστροφή 0 σε περίπτωση σφάλματος
    return 0;
  }
}

/**
 * Λαμβάνει το SOL balance από πολλά πορτοφόλια ταυτόχρονα
 * 
 * @param addresses Λίστα διευθύνσεων πορτοφολιών
 * @returns Αντικείμενο με τα balances (διεύθυνση => balance)
 */
export async function getMultipleSolBalances(addresses: string[]): Promise<Record<string, number>> {
  if (!addresses || addresses.length === 0) {
    return {};
  }
  
  const balances: Record<string, number> = {};
  const connection = new Connection(RPC_ENDPOINTS.PRIMARY);
  
  try {
    // Μετατροπή διευθύνσεων σε PublicKey αντικείμενα
    const pubkeys = addresses
      .filter(address => !!address)
      .map(address => {
        try {
          return new PublicKey(address);
        } catch (e) {
          console.warn(`Invalid address: ${address}`);
          return null;
        }
      })
      .filter((key): key is PublicKey => key !== null);
    
    if (pubkeys.length === 0) {
      return {};
    }
    
    // Λήψη όλων των balances με μία κλήση
    const balanceResponses = await connection.getMultipleAccountsInfo(pubkeys);
    
    // Επεξεργασία των αποτελεσμάτων
    pubkeys.forEach((pubkey, index) => {
      const accountInfo = balanceResponses[index];
      const address = pubkey.toString();
      
      if (accountInfo) {
        balances[address] = accountInfo.lamports / LAMPORTS_PER_SOL;
      } else {
        balances[address] = 0;
      }
    });
    
    return balances;
  } catch (error) {
    console.error("Error getting multiple SOL balances:", error);
    
    // Καταγραφή στον collector
    errorCollector.reportError(error as Error, 'WalletBalance', {
      operation: 'getMultipleSolBalances',
      addressCount: addresses.length
    });
    
    // Επιστροφή κενού αντικειμένου σε περίπτωση σφάλματος
    return {};
  }
}
