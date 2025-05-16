
export interface ApiKey {
  id: string;
  name: string;
  service: string;
  key?: string;           // Value of the API key
  description?: string;
  status: string;
  isEncrypted?: boolean;
  createdAt?: string;
  doNotSync?: boolean;    // Optional flag to prevent syncing to database
  permissions?: string[];  // Adding permissions property
}

export type ApiKeyStatus = 'active' | 'expired' | 'revoked' | 'testing';

export interface ApiKeyFilter {
  service?: string;
  status?: ApiKeyStatus;
}

export interface ApiVaultState {
  isInitialized: boolean;
  isLocked: boolean;
  passcodeSet: boolean;
}
