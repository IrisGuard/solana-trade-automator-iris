
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  created?: string; // Keep for backward compatibility
  createdAt: string;
  status: "active" | "expired" | "revoked";
  description?: string;
  expires?: string;
  source?: string;
  connected?: boolean;
  isWorking?: boolean;
  permissions?: string[];
}

export interface ApiKeyFormData {
  name: string;
  key: string;
  service: string;
  description?: string;
  expiresIn?: number;
}

export interface ServiceInfo {
  name: string;        // For backward compatibility
  service?: string;    // For backward compatibility
  count: number;
  workingCount?: number;
  expiredCount?: number;
}

export interface ApiKeyStats {
  total: number;
  active: number;
  expired: number;
  revoked: number;
}

export interface ApiKeyMetrics {
  total: number;
  active: number;
  expired: number;
  services: ServiceInfo[];
}

export interface ApiStorageOptions {
  encrypt: boolean;
  password?: string;
  storageType: 'local' | 'session' | 'supabase';
}

export interface ImportResult {
  imported: ApiKey[];
  failed: {
    data: any;
    reason: string;
  }[];
}

export interface ApiVaultState {
  keys: ApiKey[];
  metrics: ApiKeyMetrics;
  isLocked: boolean;
  password: string | null;
  backupDate: string | null;
  encryptionEnabled: boolean;
  serviceFilter: string | null;
  statusFilter: 'all' | 'active' | 'expired' | 'revoked';
  selectedKeys: string[];
  searchQuery: string;
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  category: string;
  requiresAuth?: boolean;
  apiKeyId?: string;
  is_active: boolean;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NewEndpointDialogProps {
  category: string;
  onAddEndpoint: (endpoint: ApiEndpoint) => void;
  onCancel: () => void;
}
