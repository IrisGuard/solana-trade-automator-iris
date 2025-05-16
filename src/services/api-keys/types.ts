export interface ApiKeyEntry {
  id: string;
  user_id: string;
  name: string;
  service: string;
  key_value: string;
  status: 'active' | 'expired' | 'revoked' | 'failing';
  created_at: string;
  description?: string;
  is_encrypted?: boolean;
}

export interface ApiKeyWithState extends ApiKeyEntry {
  isVisible?: boolean;
  isWorking?: boolean | null;
  isTesting?: boolean;
}

// Update ApiService to be a more comprehensive interface instead of just a string type
export interface ApiService {
  id: string;
  name: string;
  description: string;
  documentationUrl: string;
  apiKeyUrl: string;
}

// Keep the type alias for backward compatibility
export type ApiServiceType = 'helius' | 'solana' | 'coingecko' | 'other';
