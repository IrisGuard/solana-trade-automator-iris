
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  createdAt: string;
  description?: string;
  status: "active" | "expired" | "revoked";
  expires?: string;
  permissions?: string[];  
  source?: string;
  isWorking?: boolean;
  connected?: boolean;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: string;
  description?: string;
  is_active: boolean; 
  is_public: boolean; 
  category: string;  // Make this required to match the other interface
}

export interface ApiKeyStats {
  total: number;
  active: number;
  expired: number;
  revoked: number;
  servicesBreakdown: {
    name: string;
    count: number;
  }[];
}

export interface ServiceInfo {
  service: string;
  name: string;    
  workingCount: number;  
  expiredCount: number;  
  count: number;
}
