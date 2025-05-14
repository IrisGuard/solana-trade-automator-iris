
import { PublicKey, Connection } from '@solana/web3.js';
import { RPC_ENDPOINTS } from '../config';
import { errorCollector } from '@/utils/error-handling/collector';
import { Token } from '@/types/wallet';

/**
 * Φορτώνει το balance ενός συγκεκριμένου token
 */
export async function fetchTokenBalance(
  walletAddress: string,
  tokenAddress: string
): Promise<Token | null> {
  try {
    if (!walletAddress || !tokenAddress) {
      throw new Error('Απαιτούνται διεύθυνση πορτοφολιού και διεύθυνση token');
    }

    const connection = new Connection(RPC_ENDPOINTS.PRIMARY);
    
    // Δημιουργία PublicKey για το πορτοφόλι και το token
    const wallet = new PublicKey(walletAddress);
    const token = new PublicKey(tokenAddress);
    
    // Λήψη όλων των λογαριασμών token
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      wallet,
      { mint: token }
    );
    
    if (tokenAccounts.value.length === 0) {
      console.log(`Δεν βρέθηκε λογαριασμός για το token ${tokenAddress}`);
      return null;
    }
    
    // Λήψη πληροφοριών για το πρώτο token account
    const account = tokenAccounts.value[0];
    const parsedData = account.account.data.parsed;
    const info = parsedData.info;
    const tokenAmount = info.tokenAmount;
    
    // Μετατροπή του ποσού σε ανθρώπινα αναγνώσιμη μορφή
    const amount = Number(tokenAmount.amount) / Math.pow(10, tokenAmount.decimals);
    
    // Επιστροφή των στοιχείων του token
    return {
      address: tokenAddress,
      amount,
      decimals: tokenAmount.decimals,
      name: '', // Θα πρέπει να συμπληρωθεί με περαιτέρω αιτήματα
      symbol: '' // Θα πρέπει να συμπληρωθεί με περαιτέρω αιτήματα
    };
  } catch (error) {
    console.error('Error fetching token balance:', error);
    
    // Καταγραφή του σφάλματος στον collector
    errorCollector.captureError(error as Error, {
      component: 'TokenBalance',
      details: {
        walletAddress: walletAddress ? walletAddress.substring(0, 8) + '...' : 'null',
        tokenAddress: tokenAddress ? tokenAddress.substring(0, 8) + '...' : 'null'
      },
      source: 'client'
    });
    
    return null;
  }
}
