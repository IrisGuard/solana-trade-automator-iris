
import { toast } from 'sonner';

interface StoredWallet {
  address: string;
  timestamp: number;
}

// Save wallet to localStorage
export function saveWalletToLocalStorage(address: string): void {
  try {
    const walletData: StoredWallet = {
      address,
      timestamp: Date.now()
    };
    localStorage.setItem('walletData', JSON.stringify(walletData));
    console.log('Αποθήκευση πορτοφολιού στο localStorage:', address);
  } catch (error) {
    console.error('Σφάλμα αποθήκευσης πορτοφολιού στο localStorage:', error);
  }
}

// Get wallet from localStorage
export function getWalletFromLocalStorage(): StoredWallet | null {
  try {
    const walletData = localStorage.getItem('walletData');
    if (!walletData) return null;
    
    return JSON.parse(walletData) as StoredWallet;
  } catch (error) {
    console.error('Σφάλμα ανάκτησης πορτοφολιού από το localStorage:', error);
    return null;
  }
}

// Save wallet to Supabase (placeholder for now)
export async function saveWalletToSupabase(address: string, userId: string): Promise<boolean> {
  try {
    // This is a placeholder function - implement actual Supabase logic if needed
    console.log(`Θα αποθηκευόταν το πορτοφόλι ${address} για τον χρήστη ${userId} στο Supabase`);
    return true;
  } catch (error) {
    console.error('Σφάλμα αποθήκευσης πορτοφολιού στο Supabase:', error);
    return false;
  }
}

// Remove wallet from storage
export async function removeWalletFromStorage(address: string, userId?: string): Promise<void> {
  try {
    // Remove from localStorage
    localStorage.removeItem('walletData');
    
    // If userId is provided, remove from Supabase
    if (userId) {
      // Placeholder for Supabase removal
      console.log(`Θα αφαιρούνταν το πορτοφόλι ${address} για τον χρήστη ${userId} από το Supabase`);
    }
  } catch (error) {
    console.error('Σφάλμα αφαίρεσης πορτοφολιού από την αποθήκευση:', error);
  }
}
