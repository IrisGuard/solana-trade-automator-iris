
export interface ApiKey {
  id: string;
  name: string;
  service: string;
  key_value: string;
  user_id: string;
  status: string;
  created_at: string;
  is_encrypted?: boolean;
  description?: string;
}

export interface ApiKeyEntry {
  id: string;
  name: string;
  service: string;
  key_value: string;
  user_id: string;
  status: string;
  created_at: string;
  is_encrypted?: boolean;
  description?: string;
}

export interface ApiKeyWithState extends ApiKey {
  isVisible: boolean;
  isWorking: boolean;
  isTesting: boolean;
}

export interface ApiService {
  id: string;
  name: string;
  description: string;
  documentationUrl: string;
  apiKeyUrl: string;
  endpoint: string;
  isActive: boolean;
}
