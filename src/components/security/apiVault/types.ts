
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  createdAt: string;
  description?: string;
  expires?: string;
  status?: 'active' | 'expired' | 'revoked';
}
