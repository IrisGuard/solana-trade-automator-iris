
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

export type ApiService = 'helius' | 'solana' | 'coingecko' | 'other';
