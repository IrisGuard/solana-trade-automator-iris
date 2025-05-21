
export interface ApiKey {
  id: string;
  name: string;
  service: string;
  key_value: string;
  status: string;
  user_id: string;
  description?: string;
  created_at?: string;
  is_encrypted?: boolean;
}

export interface ApiService {
  id: string;
  name: string;
  endpoint: string;
  description?: string;
  isActive: boolean;
  documentationUrl?: string;
  apiKeyUrl?: string;
}

export interface ApiKeyEntry extends ApiKey {
  // Add additional properties needed for API Key entries
}

export interface ApiKeyWithState extends ApiKey {
  isVisible?: boolean;
  isWorking?: boolean;
  isTesting?: boolean;
}
