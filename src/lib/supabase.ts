
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lvkbyfocssuzcdphpmfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2a2J5Zm9jc3N1emNkcGhwbWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyNDM3NjQsImV4cCI6MjAzMDgxOTc2NH0.50sgZUiPT5vBUxnymYuoVImGSZ_1zd7F1e85CQxfKa0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
