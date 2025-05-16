
import { toast } from 'sonner';
import { 
  saveWalletToLocalStorage, 
  getWalletFromLocalStorage, 
  removeWalletFromLocalStorage 
} from './localStorage';
import { 
  loadWalletFromSupabase, 
  updateWalletLastConnected, 
  saveWalletToSupabase,
  getPrimaryWalletFromSupabase,
  updateWalletDisconnection
} from './supabaseStorage';

/**
 * Remove wallet from both localStorage and Supabase
 */
export const removeWalletFromStorage = async (
  address: string,
  userId?: string
): Promise<void> => {
  // Remove from localStorage
  removeWalletFromLocalStorage();
  
  // Remove from Supabase if user is logged in and address is provided
  if (userId && address) {
    await updateWalletDisconnection(address, userId);
  }
};

// Re-export all functions from both modules
export {
  // Local storage functions
  saveWalletToLocalStorage,
  getWalletFromLocalStorage,
  
  // Supabase storage functions
  loadWalletFromSupabase,
  updateWalletLastConnected,
  saveWalletToSupabase,
  getPrimaryWalletFromSupabase
};
