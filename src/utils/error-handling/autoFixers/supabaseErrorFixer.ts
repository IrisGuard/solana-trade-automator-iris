
import { errorCollector } from '@/utils/error-handling/collector';
import { toast } from 'sonner';

interface SupabaseClient {
  getUser: () => Promise<any>;
  getSession: () => Promise<any>;
  signInWithPassword: (credentials: { email: string, password: string }) => Promise<any>;
  signUp: (credentials: { email: string, password: string, options: any }) => Promise<any>;
  signOut: () => Promise<any>;
}

export async function fixSupabaseError(error: Error, supabaseClient?: SupabaseClient): Promise<boolean> {
  if (!supabaseClient) return false;

  // Handle session expired errors
  if (error.message?.includes('JWT expired') || 
      error.message?.includes('Invalid JWT') || 
      error.message?.includes('not authenticated')) {
    
    try {
      // Get current session
      const { data } = await supabaseClient.getSession();
      
      // If no valid session, notify user to sign in again
      if (!data.session) {
        toast.error('Your session has expired. Please sign in again.');
        await supabaseClient.signOut();
        
        // Redirect to login page can be handled outside this function
        return true;
      }
      
      return true;
    } catch (refreshError) {
      errorCollector.captureError(refreshError as Error, {
        component: 'AuthSession',
        source: 'supabase'
      });
      return false;
    }
  }

  return false;
}
