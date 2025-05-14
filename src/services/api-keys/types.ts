
// Basic API key entry
export interface ApiKeyEntry {
  id: string;
  user_id?: string;
  name: string;
  service: string;
  key_value: string;
  status: 'active' | 'expired' | 'revoked' | 'failing';
  status_message?: string;
  created_at: string;
  is_encrypted?: boolean;
  description?: string;
}

// API key with additional UI state
export interface ApiKeyWithState extends ApiKeyEntry {
  isVisible?: boolean;
  isWorking?: boolean;
  isTesting?: boolean;
}

// API service information
export interface ApiService {
  id: string;
  name: string;
  description: string;
  endpoint?: string;
  documentationUrl?: string;
  apiKeyUrl?: string;
}

// API key checking result
export interface ApiKeyCheckResult {
  keyId: string;
  service: string;
  isWorking: boolean;
  errorMessage?: string;
}
