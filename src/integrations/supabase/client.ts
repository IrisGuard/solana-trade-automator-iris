
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lvkbyfocssuzcdphpmfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2a2J5Zm9jc3N1emNkcGhwbWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDk3NTIsImV4cCI6MjA2MjM4NTc1Mn0.fkQe2TgniccYP-AvrYnFL_ladauqL7-ULiTagMDszhc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export dbClient as alias for compatibility
export const dbClient = supabase;

// Function to check Supabase connection
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    return !error;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
};
