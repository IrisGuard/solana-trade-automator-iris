
import { BotError } from '../errorTypes';
import { supabase } from '@/lib/supabase';

export async function fixSupabaseError(error: BotError): Promise<boolean> {
  try {
    if (error.message.includes('JWT expired')) {
      // Fix for JWT expired errors
      try {
        // In newer versions of Supabase JS client, we need to use getSession first
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData && sessionData.session) {
          // If we have a session, try to refresh it
          const { data } = await supabase.auth.refreshSession();
          return !!data.session;
        }
        return false;
      } catch (refreshError) {
        console.error("Error refreshing session:", refreshError);
        return false;
      }
    }
    
    if (error.message.includes('network error')) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      // Note: supabase doesn't have a direct reconnect method, it will auto-reconnect
      return true;
    }
    
    return false;
  } catch (fixError) {
    console.error("Error fixing Supabase error:", fixError);
    return false;
  }
}
