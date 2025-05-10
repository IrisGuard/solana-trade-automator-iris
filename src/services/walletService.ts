
import { walletService as dbWalletService, tokensService } from '@/services/database';
import { Token } from '@/types/wallet';
import { toast } from 'sonner';

export const walletService = {
  saveWalletToDatabase: async (userId: string | undefined, address: string, tokens: Token[]): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      // Save wallet address
      await dbWalletService.saveWalletAddress(userId, address);
      
      // Also save tokens to database
      await tokensService.saveTokens(userId, tokens);
      
      toast.success('Το πορτοφόλι συνδέθηκε και αποθηκεύτηκε στο λογαριασμό σας');
      return true;
    } catch (err) {
      console.error('Error saving wallet to database:', err);
      toast.error('Το πορτοφόλι συνδέθηκε αλλά απέτυχε η αποθήκευση στο λογαριασμό σας');
      return false;
    }
  },
  
  loadSavedWallet: async (userId: string | undefined): Promise<{address: string} | null> => {
    if (!userId) return null;
    
    try {
      return await dbWalletService.getPrimaryWallet(userId);
    } catch (err) {
      console.error('Error loading saved wallet:', err);
      toast.error('Αποτυχία αυτόματης σύνδεσης πορτοφολιού');
      return null;
    }
  }
};
