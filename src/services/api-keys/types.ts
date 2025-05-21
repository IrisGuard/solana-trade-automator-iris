
export interface ApiKey {
  id: string;
  name: string;
  service: string;
  key_value: string;
  status: string;
  user_id: string;
  description?: string;
  created_at?: string;
}

export interface ApiService {
  id: string;
  name: string;
  endpoint: string;
  description?: string;
  isActive: boolean;
}

export interface ApiKeyEntry extends ApiKey {
  // Add additional properties needed for API Key entries
}
