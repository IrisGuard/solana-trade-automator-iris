
export interface ApiKey {
  id: string;
  name: string;
  service: string;
  value: string;
  created: Date;
  expires?: string | null; // Changed from Date to string to match main types
  status: 'active' | 'expired' | 'revoked';
}

// Provide minimal demo keys for development
export const demoKeys: ApiKey[] = [
  {
    id: 'demo-key-1',
    name: 'Demo Helius API Key',
    service: 'helius',
    value: 'demo-key-••••••••••••',
    created: new Date(),
    status: 'active',
    expires: null
  }
];

export function getDemoApiKeys(): ApiKey[] {
  return demoKeys;
}
