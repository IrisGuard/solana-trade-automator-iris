
export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  description?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  category: string;
  requiresAuth: boolean;
  status?: 'active' | 'inactive' | 'deprecated';
}

export interface ApiCategory {
  name: string;
  endpoints: ApiEndpoint[];
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  expiresAt?: string;
  lastUsed?: string;
  status: 'active' | 'inactive' | 'revoked';
}
