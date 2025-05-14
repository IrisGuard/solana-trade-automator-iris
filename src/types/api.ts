
export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  category: string;
  is_active?: boolean;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}
