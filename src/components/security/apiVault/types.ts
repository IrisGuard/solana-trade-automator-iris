
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  created: string;       // Keep for backward compatibility
  createdAt?: string;    // Allow both naming conventions
  status?: 'active' | 'expired' | 'revoked';
  description?: string;
  expires?: string;      // Add expires field
  source?: string;       // Add source field
  permissions?: string[];// Add permissions field
  connected?: boolean;   // Add connected field
  isWorking?: boolean;   // Add isWorking field
}

export interface ApiKeyStats {
  total: number;
  active: number;
  expired: number;
  revoked: number;
}

export interface ServiceInfo {
  name: string;
  count: number;
  icon?: React.ReactNode;
  workingCount?: number; // Add workingCount field
}
