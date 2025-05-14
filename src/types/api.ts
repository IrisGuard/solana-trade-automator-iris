
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  created: string;       // Used for consistency with DB
  createdAt?: string;    // Allow both naming conventions
  description?: string;
  status: 'active' | 'expired' | 'revoked';
  expires?: string;      // Add expires field
  source?: string;       // Add source field
  permissions?: string[];// Add permissions field
  connected?: boolean;   // Add connected field
  isWorking?: boolean;   // Add isWorking field
}

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  category: string;
  is_active: boolean;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceInfo {
  name: string;
  totalKeys: number;
  activeKeys: number;
  expiredKeys: number;
  workingCount: number; // Add workingCount field
}
