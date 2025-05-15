
import { BotError } from '../errorTypes';
import { supabase } from '@/lib/supabase';

export async function fixSupabaseError(error: BotError): Promise<boolean> {
  try {
    if (error.message.includes('JWT expired')) {
      const { data } = await supabase.auth.refreshSession();
      return !!data.session;
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
