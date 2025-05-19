
/**
 * Types for API key management
 */

export type ApiKeyStatus = 'active' | 'expired' | 'revoked' | 'failing';

export interface ApiKeyEntry {
  id: string;
  user_id: string;
  name: string;
  service: string;
  key_value: string;
  status: ApiKeyStatus;
  description?: string;
  created_at: string;
  is_encrypted?: boolean;
  updated_at?: string;
}

export interface ApiKeyWithState extends ApiKeyEntry {
  isVisible: boolean;
  isWorking: boolean;
  isTesting: boolean;
}

export interface ApiKeyFilterOptions {
  service?: string;
  status?: ApiKeyStatus;
  search?: string;
}

export interface ApiKeyServiceInfo {
  name: string;
  description: string;
  icon: React.ReactNode;
  testEndpoint?: string;
  isCommon: boolean;
}

export interface ApiService {
  id: string;
  name: string;
  description: string;
  documentationUrl: string;
  apiKeyUrl: string;
}
