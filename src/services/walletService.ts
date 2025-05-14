
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';

export interface WalletData {
  id: string;
  user_id: string;
  address: string;
  blockchain: string;
  is_primary: boolean;
  last_connected: string;
  created_at: string;
  updated_at: string;
}

export const walletService = {
  /**
   * Save wallet to Supabase
   */
  async saveWallet(
    userId: string,
    walletAddress: string,
    blockchain: string = 'solana'
  ): Promise<WalletData | null> {
    try {
      // Check if this wallet already exists for this user
      const { data: existingWallets } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .eq('address', walletAddress);
        
      if (existingWallets && existingWallets.length > 0) {
        // Update existing wallet
        const { data, error } = await supabase
          .from('wallets')
          .update({
            last_connected: new Date().toISOString(),
            is_primary: true
          })
          .eq('id', existingWallets[0].id)
          .select();
          
        if (error) throw error;
        
        // Set all other wallets as non-primary
        await supabase
          .from('wallets')
          .update({ is_primary: false })
          .eq('user_id', userId)
          .neq('id', existingWallets[0].id);
        
        return data[0];
      } else {
        // Set all existing wallets as non-primary
        await supabase
          .from('wallets')
          .update({ is_primary: false })
          .eq('user_id', userId);
          
        // Create new wallet record
        const { data, error } = await supabase
          .from('wallets')
          .insert({
            address: walletAddress,
            user_id: userId,
            blockchain,
            is_primary: true,
            last_connected: new Date().toISOString()
          })
          .select();
        
        if (error) throw error;
        return data[0];
      }
    } catch (err) {
      errorCollector.captureError(
        err instanceof Error ? err : new Error('Error saving wallet'),
        { component: 'walletService', source: 'saveWallet' }
      );
      return null;
    }
  },

  /**
   * Load saved wallet from Supabase
   */
  async getUserWallets(userId: string): Promise<WalletData[]> {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .order('last_connected', { ascending: false });
        
      if (error) throw error;
      return data;
    } catch (err) {
      errorCollector.captureError(
        err instanceof Error ? err : new Error('Error loading wallets'),
        { component: 'walletService', source: 'getUserWallets' }
      );
      return [];
    }
  },
  
  /**
   * Get primary wallet for user
   */
  async getPrimaryWallet(userId: string): Promise<WalletData | null> {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .eq('is_primary', true)
        .single();
        
      if (error) throw error;
      return data;
    } catch (err) {
      errorCollector.captureError(
        err instanceof Error ? err : new Error('Error loading primary wallet'),
        { component: 'walletService', source: 'getPrimaryWallet' }
      );
      return null;
    }
  },

  /**
   * Update wallet last connected timestamp in Supabase
   */
  async updateWalletLastConnected(walletId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('wallets')
        .update({ last_connected: new Date().toISOString() })
        .eq('id', walletId);
        
      if (error) throw error;
      return true;
    } catch (err) {
      errorCollector.captureError(
        err instanceof Error ? err : new Error('Error updating wallet last connected'),
        { component: 'walletService', source: 'updateWalletLastConnected' }
      );
      return false;
    }
  },
  
  /**
   * Set a wallet as primary
   */
  async setPrimaryWallet(userId: string, walletId: string): Promise<boolean> {
    try {
      // First set all wallets as non-primary
      await supabase
        .from('wallets')
        .update({ is_primary: false })
        .eq('user_id', userId);
        
      // Then set the selected wallet as primary
      const { error } = await supabase
        .from('wallets')
        .update({ is_primary: true })
        .eq('id', walletId);
      
      if (error) throw error;
      return true;
    } catch (err) {
      errorCollector.captureError(
        err instanceof Error ? err : new Error('Error setting primary wallet'),
        { component: 'walletService', source: 'setPrimaryWallet' }
      );
      return false;
    }
  },
  
  /**
   * Delete a wallet
   */
  async deleteWallet(walletId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('wallets')
        .delete()
        .eq('id', walletId);
        
      if (error) throw error;
      return true;
    } catch (err) {
      errorCollector.captureError(
        err instanceof Error ? err : new Error('Error deleting wallet'),
        { component: 'walletService', source: 'deleteWallet' }
      );
      return false;
    }
  }
};
