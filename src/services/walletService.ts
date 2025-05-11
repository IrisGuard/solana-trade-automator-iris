
import { dbClient } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/client';
import { Token } from '@/types/wallet';
import { tokensService } from './tokensService';
import { toast } from 'sonner';

export const walletService = {
  async saveWalletAddress(userId: string, address: string) {
    const { data, error } = await dbClient
      .from('wallets')
      .upsert({ 
        user_id: userId, 
        address, 
        last_connected: new Date().toISOString(),
        is_primary: true,
        blockchain: 'solana' 
      });
    
    if (error) throw error;
    return data;
  },
  
  async getWalletByUser(userId: string) {
    const { data, error } = await dbClient
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false });
    
    if (error) throw error;
    return data as Tables['wallets'][];
  },

  async getPrimaryWallet(userId: string) {
    const { data, error } = await dbClient
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is not an error in this context
      throw error;
    }
    
    return data as Tables['wallets'] | null;
  },

  saveWalletToDatabase: async (userId: string | undefined, address: string, tokens: Token[]): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      // Save wallet address
      await walletService.saveWalletAddress(userId, address);
      
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
      return await walletService.getPrimaryWallet(userId);
    } catch (err) {
      console.error('Error loading saved wallet:', err);
      toast.error('Αποτυχία αυτόματης σύνδεσης πορτοφολιού');
      return null;
    }
  }
};
