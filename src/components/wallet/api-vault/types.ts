
export interface ApiKey {
  id: string;
  name: string;
  service: string;
  key: string;
  connected: boolean;
  createdAt: string;
  status?: 'active' | 'expired' | 'revoked';
}

export interface RecommendedApi {
  name: string;
  description: string;
  url: string;
}

export interface ApiSettings {
  rpcEndpoint: string;
  apiEndpoint: string;
  websocketEndpoint: string;
  rpcUrl?: string;
  customRpc?: boolean;
  fallbackRpc?: boolean;
  rateLimit?: number;
}
