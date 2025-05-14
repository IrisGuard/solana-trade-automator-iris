
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  created: string;       // Used for consistency with DB
  createdAt?: string;    // Allow both naming conventions
  description?: string;
  status: 'active' | 'expired' | 'revoked';
  expires?: string;     
  source?: string;      
  permissions?: string[];
  connected?: boolean;   
  isWorking?: boolean;   
}

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  category: string; // Making this required for consistency
  is_active: boolean;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
  method?: string;
  description?: string;
}

export interface ServiceInfo {
  name: string;
  totalKeys: number;
  activeKeys: number;
  expiredKeys: number;
  workingCount: number;
  count?: number;  // Add count to be compatible with other code
}
