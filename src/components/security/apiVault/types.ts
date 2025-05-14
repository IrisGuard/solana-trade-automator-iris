
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  createdAt: string;
  description?: string;
  status: "active" | "expired" | "revoked";
  expires?: string;
  permissions?: string[];  // Προσθήκη πεδίου permissions
  source?: string;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: string;
  description?: string;
  is_active: boolean; // Προσθήκη του πεδίου is_active
  is_public: boolean; // Προσθήκη του πεδίου is_public
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
  service: string; // Unique service identifier
  name: string;    // Display name for the service
  workingCount: number;  // Number of working keys
  expiredCount: number;  // Number of expired keys
}
