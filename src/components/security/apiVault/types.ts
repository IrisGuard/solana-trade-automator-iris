
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  createdAt: string;
  description?: string;
  expires?: string;
  status?: 'active' | 'expired' | 'revoked';
  isWorking?: boolean;
  source?: string; // Προσθήκη ιδιότητας source για την προέλευση του κλειδιού
}

export interface ApiKeyStats {
  total: number;
  active: number;
  expired: number;
  revoked: number;
  working?: number;
  notWorking?: number;
}

export interface ServiceInfo {
  name: string;
  count: number;
  workingCount: number;
}
