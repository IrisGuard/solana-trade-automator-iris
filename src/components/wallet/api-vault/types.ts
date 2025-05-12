
export interface ApiKey {
  name: string;
  connected: boolean;
  description?: string;
  url?: string;
}

export interface ApiSettings {
  rpcUrl: string;
  customRpc: boolean;
  fallbackRpc: boolean;
  rateLimit: number;
}

export interface RecommendedApi {
  name: string;
  description: string;
  url: string;
}
