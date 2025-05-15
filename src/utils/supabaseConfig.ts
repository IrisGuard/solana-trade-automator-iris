
/**
 * Configuration utility for Supabase connection details
 * Using constants for production builds to avoid Vite environment variable issues
 */

const SUPABASE_URL = 'https://lvkbyfocssuzcdphpmfu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2a2J5Zm9jc3N1emNkcGhwbWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDk3NTIsImV4cCI6MjA2MjM4NTc1Mn0.fkQe2TgniccYP-AvrYnFL_ladauqL7-ULiTagMDszhc';

// In a real application, these would come from environment variables:
// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfig = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
  projectId: 'lvkbyfocssuzcdphpmfu'
};

// Determine which environment we're in
export const isProd = () => import.meta.env.PROD;
export const isDev = () => import.meta.env.DEV;
