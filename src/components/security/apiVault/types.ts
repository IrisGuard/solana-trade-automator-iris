
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  created?: string; // Προσθέτουμε το πεδίο created που λείπει
  createdAt: string;
  status: "active" | "expired" | "revoked";
  description?: string;
  expires?: string; // Προσθέτουμε το πεδίο expires ως προαιρετικό
  source?: string; // Προσθέτουμε το προαιρετικό πεδίο source
  connected?: boolean; // Προσθέτουμε το προαιρετικό πεδίο connected
  isWorking?: boolean; // Προσθέτουμε το προαιρετικό πεδίο isWorking
}

export interface ApiKeyFormData {
  name: string;
  key: string;
  service: string;
  description?: string;
  expiresIn?: number;
}

export interface ServiceInfo {
  service: string;
  count: number;
  workingCount: number; // Προσθέτουμε το πεδίο workingCount που λείπει
  expiredCount: number;
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
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  category: string;
  requiresAuth: boolean;
  apiKeyId?: string;
}

export interface NewEndpointDialogProps {
  onAddEndpoint: (endpoint: ApiEndpoint) => void;
  onCancel: () => void;
}
