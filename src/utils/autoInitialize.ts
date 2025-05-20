
import { ensureAuthenticated } from '@/integrations/supabase/client';
import { initializeDatabase, syncHeliusKeys } from '@/utils/databaseInitializer';
import { toast } from 'sonner';

/**
 * Automatically performs the initial setup:
 * 1. Ensures user is authenticated
 * 2. Initializes the database with sample data
 * 3. Synchronizes Helius API keys
 */
export async function autoInitialize(): Promise<boolean> {
  try {
    // Step 1: Ensure authentication
    console.log('Step 1: Ensuring authentication...');
    const isAuthenticated = await ensureAuthenticated();
    
    if (!isAuthenticated) {
      console.error('Failed to authenticate user');
      toast.error('Αδυναμία αυτόματης σύνδεσης');
      return false;
    }
    
    // Step 2: Initialize database
    console.log('Step 2: Initializing database...');
    const dbInitialized = await initializeDatabase();
    
    if (!dbInitialized) {
      console.error('Failed to initialize database');
      toast.error('Αδυναμία αρχικοποίησης βάσης δεδομένων');
      return false;
    }
    
    // Step 3: Sync Helius keys
    console.log('Step 3: Syncing Helius keys...');
    const keysInitialized = await syncHeliusKeys();
    
    if (!keysInitialized) {
      console.warn('Failed to sync Helius keys, but continuing');
      toast.warning('Τα κλειδιά Helius δεν συγχρονίστηκαν πλήρως');
    }
    
    toast.success('Η εφαρμογή αρχικοποιήθηκε με επιτυχία!');
    return true;
  } catch (error) {
    console.error('Auto-initialization error:', error);
    toast.error('Σφάλμα κατά την αυτόματη αρχικοποίηση');
    return false;
  }
}

/**
 * Checks if database is already initialized by checking for existing data
 */
export async function isInitialized(): Promise<boolean> {
  try {
    // Import here to avoid circular dependencies
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    
    // Check if profile exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .single();
      
    if (!profile) return false;
    
    // Check if wallet exists
    const { data: wallets } = await supabase
      .from('wallets')
      .select('id')
      .eq('user_id', session.user.id);
      
    if (!wallets || wallets.length === 0) return false;
    
    // Check if tokens exist
    const { data: tokens } = await supabase
      .from('tokens')
      .select('id')
      .eq('user_id', session.user.id);
      
    if (!tokens || tokens.length === 0) return false;
    
    // Check if bots exist
    const { data: bots } = await supabase
      .from('bots')
      .select('id')
      .eq('user_id', session.user.id);
      
    if (!bots || bots.length === 0) return false;
    
    // All checks passed
    return true;
  } catch (error) {
    console.error('Error checking initialization status:', error);
    return false;
  }
}
