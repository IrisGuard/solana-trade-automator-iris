
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  created: string;
  createdAt?: string;
  status?: string;
  description?: string;
  isWorking?: boolean;
  permissions?: string[];
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
}
