
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Save wallet to localStorage for quick reconnect
 */
export const saveWalletToLocalStorage = (address: string): void => {
  localStorage.setItem('phantom_wallet', JSON.stringify({
    address,
    timestamp: Date.now()
  }));
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
        .update({ is_primary: false })
        .eq('user_id', userId)
        .neq('id', existingWallets[0].id);
      
      if (updateOthersError) throw updateOthersError;
      
      return true;
    } else {
      // Set all existing wallets as non-primary
      const { error: resetError } = await supabase
        .from('wallets')
        .update({ is_primary: false })
        .eq('user_id', userId);
        
      if (resetError) throw resetError;
      
      // Create new wallet record
      const { error: insertError } = await supabase
        .from('wallets')
        .insert({
          address,
          user_id: userId,
          blockchain: 'solana',
          is_primary: true,
          last_connected: new Date().toISOString()
        });
      
      if (insertError) throw insertError;
      
      return true;
    }
  } catch (err) {
    console.error('Error saving wallet to database:', err);
    return false;
  }
};

/**
 * Load saved wallet from Supabase
 */
export const loadWalletFromSupabase = async (userId: string): Promise<{address: string, id: string} | null> => {
  try {
    const { data: wallets, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .eq('is_primary', true);
      
    if (!error && wallets && wallets.length > 0) {
      return {
        address: wallets[0].address,
        id: wallets[0].id
      };
    }
    return null;
  } catch (err) {
    console.error('Error loading wallet from database:', err);
    return null;
  }
};

/**
 * Update wallet last connected timestamp in Supabase
 */
export const updateWalletLastConnected = async (walletId: string): Promise<void> => {
  try {
    await supabase
      .from('wallets')
      .update({ last_connected: new Date().toISOString() })
      .eq('id', walletId);
  } catch (err) {
    console.error('Error updating wallet last connected:', err);
  }
};
