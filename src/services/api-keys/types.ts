
export interface ApiKeyEntry {
  id: string;
  user_id: string;
  name: string;
  service: string;
  key_value: string;
  status: string;
  created_at: string;
  description?: string;
  is_encrypted?: boolean;
}
