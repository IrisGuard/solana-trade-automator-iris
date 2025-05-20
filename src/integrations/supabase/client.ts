
// Import Supabase client correctly - version 2.49.4 requires importing from @supabase/supabase-js directly
import { createClient } from '@supabase/supabase-js';

// Hardcoded values for reliability - these are already public values
const SUPABASE_URL = 'https://lvkbyfocssuzcdphpmfu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2a2J5Zm9jc3N1emNkcGhwbWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDk3NTIsImV4cCI6MjA2MjM4NTc1Mn0.fkQe2TgniccYP-AvrYnFL_ladauqL7-ULiTagMDszhc';

// Create client with correct format
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

// Export default DB client for backward compatibility
export const dbClient = supabase;

// Auto-login function
export async function ensureAuthenticated() {
  try {
    // Check if user is already logged in
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('No active session, attempting auto-login...');
      
      // Try auto-login with test credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword123'
      });
      
      if (error) {
        console.log('Auto-login failed, attempting to create test account...');
        
        // Create test account if login fails
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: 'test@example.com',
          password: 'testpassword123'
        });
        
        if (signUpError) {
          console.error('Failed to create test account:', signUpError);
          return false;
        }
        
        console.log('Test account created successfully');
        
        // Try logging in again
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: 'test@example.com',
          password: 'testpassword123'
        });
        
        if (loginError) {
          console.error('Failed to log in with new account:', loginError);
          return false;
        }
      }
      
      console.log('Auto-login successful');
      return true;
    }
    
    console.log('User already authenticated');
    return true;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
}

// Add error logging for critical operations
supabase.auth.onAuthStateChange((event, session) => {
  console.log(`Auth state changed: ${event}`);
});

// Simple check function to verify the client is working
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    return !error;
  } catch (e) {
    console.error('Failed to connect to Supabase:', e);
    return false;
  }
}

// Type for database tables, to be fully defined when needed
export type Tables = any;

// Also export createClient for use in other files if needed
export { createClient };
