
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
      toast.error('Αδυναμία αυτόματης σύνδεσης', {
        description: 'Παρακαλούμε συνδεθείτε χειροκίνητα'
      });
      return false;
    }
    
    // Step 2: Initialize database with retry
    console.log('Step 2: Initializing database...');
    let dbInitialized = false;
    let attempts = 0;
    
    while (!dbInitialized && attempts < 3) {
      attempts++;
      console.log(`Database initialization attempt ${attempts}`);
      
      try {
        dbInitialized = await initializeDatabase();
        if (dbInitialized) break;
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.error(`Database initialization attempt ${attempts} failed:`, err);
      }
    }
    
    if (!dbInitialized) {
      console.error('Failed to initialize database after multiple attempts');
      toast.error('Αδυναμία αρχικοποίησης βάσης δεδομένων', {
        description: 'Δοκιμάστε να ανανεώσετε τη σελίδα'
      });
      return false;
    }
    
    // Step 3: Sync Helius keys
    console.log('Step 3: Syncing Helius keys...');
    let keysInitialized = false;
    attempts = 0;
    
    while (!keysInitialized && attempts < 3) {
      attempts++;
      console.log(`Helius key sync attempt ${attempts}`);
      
      try {
        keysInitialized = await syncHeliusKeys();
        if (keysInitialized) break;
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.error(`Helius key sync attempt ${attempts} failed:`, err);
      }
    }
    
    if (!keysInitialized) {
      console.warn('Failed to sync Helius keys, but continuing');
      toast.warning('Τα κλειδιά Helius δεν συγχρονίστηκαν πλήρως', {
        description: 'Ορισμένες λειτουργίες ενδέχεται να μην είναι διαθέσιμες'
      });
      // Continue despite Helius key issues
    } else {
      toast.success('Τα κλειδιά API συγχρονίστηκαν με επιτυχία');
    }
    
    toast.success('Η εφαρμογή αρχικοποιήθηκε με επιτυχία!');
    return true;
  } catch (error) {
    console.error('Auto-initialization error:', error);
    toast.error('Σφάλμα κατά την αυτόματη αρχικοποίηση', {
      description: 'Παρακαλούμε δοκιμάστε να ανανεώσετε τη σελίδα'
    });
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
    
    try {
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single();
      
      if (profileError || !profile) {
        console.log('Profile not found, database not initialized');
        return false;
      }
      
      // Check if wallet exists
      const { data: wallets, error: walletsError } = await supabase
        .from('wallets')
        .select('id')
        .eq('user_id', session.user.id);
      
      if (walletsError || !wallets || wallets.length === 0) {
        console.log('No wallets found, database not initialized');
        return false;
      }
      
      // If we get here, database is initialized
      console.log('Database appears to be initialized');
      return true;
    } catch (error) {
      console.error('Error checking specific tables:', error);
      return false;
    }
  } catch (error) {
    console.error('Error checking initialization status:', error);
    return false;
  }
}
