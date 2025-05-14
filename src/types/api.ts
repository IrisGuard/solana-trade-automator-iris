
export interface ApiEndpoint {
  id?: string;  // Making id optional to match with supabaseEndpoints.ts
  name: string;
  url: string;
  category?: string;
  is_active?: boolean;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}
