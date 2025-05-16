
import { supabase } from '@/integrations/supabase/client';

/**
 * Load wallet from Supabase by user ID
 */
export const loadWalletFromSupabase = async (userId: string): Promise<{ id: string, address: string } | null> => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('wallets')
      .select('id, address')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .limit(1)
      .single();
      
    if (error || !data) {
      console.error('Error loading wallet from Supabase:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Error in loadWalletFromSupabase:', err);
    return null;
  }
};

/**
 * Update wallet last_connected timestamp in Supabase
 */
export const updateWalletLastConnected = async (walletId: string): Promise<boolean> => {
  if (!walletId) return false;
  
  try {
    const { error } = await supabase
      .from('wallets')
      .update({ last_connected: new Date().toISOString() })
      .eq('id', walletId);
      
    if (error) {
      console.error('Error updating wallet last_connected:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in updateWalletLastConnected:', err);
    return false;
  }
};

/**
 * Save wallet to Supabase if user is logged in
 */
export const saveWalletToSupabase = async (
  address: string, 
  userId: string | undefined
): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Check if this wallet already exists for this user
    const { data: existingWallets, error: fetchError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .eq('address', address);
      
    if (fetchError) throw fetchError;
    
    if (existingWallets && existingWallets.length > 0) {
      // Update existing wallet
      const { error: updateError } = await supabase
        .from('wallets')
        .update({
          last_connected: new Date().toISOString(),
          is_primary: true
        })
        .eq('id', existingWallets[0].id);
        
      if (updateError) throw updateError;
      
      // Set all other wallets as non-primary
      const { error: updateOthersError } = await supabase
        .from('wallets')
        .update({
          is_primary: false
        })
        .eq('user_id', userId)
        .neq('address', address);
        
      if (updateOthersError) throw updateOthersError;
      
      return true;
    } else {
      // Create new wallet
      const { error: insertError } = await supabase
        .from('wallets')
        .insert({
          user_id: userId,
          address,
          blockchain: 'solana',
          is_primary: true,
          created_at: new Date().toISOString(),
          last_connected: new Date().toISOString()
        });
        
      if (insertError) throw insertError;
      
      // Set all other wallets as non-primary
      const { error: updateOthersError } = await supabase
        .from('wallets')
        .update({
          is_primary: false
        })
        .eq('user_id', userId)
        .neq('address', address);
        
      if (updateOthersError) throw updateOthersError;
      
      return true;
    }
  } catch (error) {
    console.error('Error saving wallet to Supabase:', error);
    return false;
  }
};

/**
 * Get the primary wallet for a user from Supabase
 */
export const getPrimaryWalletFromSupabase = async (
  userId: string
): Promise<string | null> => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('wallets')
      .select('address')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .limit(1);
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data[0].address;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching primary wallet from Supabase:', error);
    return null;
  }
};

/**
 * Update wallet in Supabase when disconnecting
 */
export const updateWalletDisconnection = async (
  address: string,
  userId: string
): Promise<boolean> => {
  if (!userId || !address) return false;
  
  try {
    const { error } = await supabase
      .from('wallets')
      .update({
        is_primary: false,
        last_connected: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('address', address);
      
    if (error) {
      console.error('Error updating wallet in Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error handling wallet disconnection in Supabase:', error);
    return false;
  }
};
