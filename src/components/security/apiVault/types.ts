
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
  isWorking?: boolean;    // Flag for whether the key is functional
  expires?: string;       // Expiration date for the key
  source?: string;        // Source information about where the key came from
  connected?: boolean;    // Whether the key is connected to a service
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

// Add the missing ApiKeyStats interface
export interface ApiKeyStats {
  total: number;
  active: number;
  expired: number;
  revoked: number;
  servicesBreakdown?: Array<{name: string, count: number}>;
}

// Add the missing ServiceInfo interface
export interface ServiceInfo {
  name: string;
  service?: string;
  count: number;
  workingCount?: number;
  expiredCount?: number;
  totalKeys?: number;
  activeKeys?: number;
}
