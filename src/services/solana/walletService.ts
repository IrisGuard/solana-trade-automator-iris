
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'sonner';
import { connection } from './config';
import { errorCollector } from '@/utils/error-handling/collector';

// Export named function for individual import
export const fetchSOLBalance = async (address: string): Promise<number> => {
  try {
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL; // Convert from lamports to SOL
  } catch (error) {
    // Καταγραφή σφάλματος και εμφάνιση πιο φιλικού μηνύματος
    console.error('Error getting SOL balance:', error);
    
    // Έλεγχος για σφάλματα rate limit
    const errorStr = String(error);
    if (errorStr.includes('rate limit') || errorStr.includes('429')) {
      toast.error('Solana API rate limit exceeded. Please try again in a moment.');
      
      // Επιστροφή τιμής 0 αντί για αποτυχία
      return 0;
    }
    
    // Γενικό σφάλμα για άλλες περιπτώσεις
    toast.error('Failed to get SOL balance');
    
    // Προσθήκη στον collector σφαλμάτων για περαιτέρω ανάλυση
    errorCollector.addError({
      message: 'Failed to get SOL balance',
      source: 'client',
      stack: errorStr,
      details: { address }
    });
    
    return 0;
  }
};

// Keep backwards compatibility with existing code
export const walletService = {
  // Get connection instance
  getConnection: () => connection,
  
  // Get SOL balance for a given address
  getSolBalance: fetchSOLBalance,
  
  // Send token functionality (to be implemented)
  sendToken: async () => {
    // To be implemented in the future
    toast.error('Token sending functionality has not been implemented yet');
    return false;
  }
};
