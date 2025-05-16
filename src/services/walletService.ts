
import { dbClient } from '@/integrations/supabase/client';
import { Token } from '@/types/wallet';
import { tokensService } from './tokensService';
import { toast } from 'sonner';

// Define a type for database wallets
interface DBWallet {
  id: string;
  user_id: string;
  address: string;
  blockchain: string;
  is_primary: boolean;
  last_connected?: string;
  created_at?: string;
  updated_at?: string;
}

export const walletService = {
  async saveWalletAddress(userId: string, address: string) {
    try {
      // First check if this wallet already exists for this user
      const { data: existingWallets, error: fetchError } = await dbClient
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .eq('address', address);
      
      if (fetchError) throw fetchError;
      
      if (existingWallets && existingWallets.length > 0) {
        // Update existing wallet
        const { error: updateError } = await dbClient
          .from('wallets')
          .update({ 
            last_connected: new Date().toISOString(),
            is_primary: true 
          })
          .eq('id', existingWallets[0].id);
        
        if (updateError) throw updateError;
        
        // Set all other wallets for this user to non-primary
        await dbClient
          .from('wallets')
          .update({ is_primary: false })
          .eq('user_id', userId)
          .neq('id', existingWallets[0].id);
          
        return existingWallets[0];
      } else {
        // Set all existing wallets to non-primary
        await dbClient
          .from('wallets')
          .update({ is_primary: false })
          .eq('user_id', userId);
        
        // Create new wallet
        const { data, error } = await dbClient
          .from('wallets')
          .insert({ 
            user_id: userId, 
            address, 
            last_connected: new Date().toISOString(),
            is_primary: true,
            blockchain: 'solana' 
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (err) {
      console.error('Error saving wallet address:', err);
      throw err;
    }
  },
  
  async getWalletByUser(userId: string) {
    try {
      const { data, error } = await dbClient
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .order('is_primary', { ascending: false });
      
      if (error) throw error;
      return data as DBWallet[];
    } catch (err) {
      console.error('Error getting wallets by user:', err);
      return [];
    }
  },

  async getPrimaryWallet(userId: string) {
    try {
      const { data, error } = await dbClient
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .eq('is_primary', true)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is not an error in this context
        throw error;
      }
      
      return data as DBWallet | null;
    } catch (err) {
      console.error('Error getting primary wallet:', err);
      return null;
    }
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
  },

  // Create initial transaction record for the wallet
  createInitialTransaction: async (userId: string, walletAddress: string): Promise<boolean> => {
    try {
      const { data: existingTransactions } = await dbClient
        .from('transactions')
        .select('id')
        .eq('user_id', userId)
        .eq('wallet_address', walletAddress)
        .limit(1);
      
      // Only create initial transaction if none exist
      if (!existingTransactions || existingTransactions.length === 0) {
        const { error } = await dbClient
          .from('transactions')
          .insert({
            user_id: userId,
            wallet_address: walletAddress,
            signature: `init_${Date.now()}`,
            type: 'Σύνδεση',
            status: 'Success',
            amount: '0',
            block_time: new Date().toISOString()
          });
          
        if (error) throw error;
      }
      
      return true;
    } catch (err) {
      console.error('Error creating initial transaction:', err);
      return false;
    }
  }
};
