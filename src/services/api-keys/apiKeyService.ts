import { ApiKey, ApiKeyEntry, ApiKeyWithState } from './types';

export class ApiKeyService {
  static async fetchUserApiKeys(userId: string): Promise<ApiKeyWithState[]> {
    // Mock implementation for demo purposes
    return [
      {
        id: '1',
        user_id: userId,
        name: 'Helius API Key',
        service: 'helius',
        key_value: 'hl_b865d0a3c9884e80a7a8af66f9846154',
        status: 'active',
        created_at: new Date().toISOString(),
        description: 'Main Helius API key for RPC calls',
        is_encrypted: false,
        isVisible: false,
        isWorking: true,
        isTesting: false
      },
      {
        id: '2',
        user_id: userId,
        name: 'Jupiter API Key',
        service: 'jupiter',
        key_value: 'jp_4db7c1e98f5a4b01b2e9fcde3a9d7e27',
        status: 'active',
        created_at: new Date().toISOString(),
        description: 'Jupiter Swap API access',
        is_encrypted: true,
        isVisible: false,
        isWorking: true,
        isTesting: false
      }
    ];
  }
  
  static async saveApiKey(apiKey: ApiKeyEntry): Promise<ApiKeyEntry> {
    // Mock implementation for demo purposes
    console.log('Saving API key:', apiKey);
    return {
      ...apiKey,
      created_at: apiKey.created_at || new Date().toISOString(),
      id: apiKey.id || Math.random().toString(36).substring(2, 9)
    };
  }
  
  static async deleteApiKey(keyId: string, userId: string): Promise<boolean> {
    // Mock implementation for demo purposes
    console.log(`Deleting API key ${keyId} for user ${userId}`);
    return true;
  }
  
  static async testApiKey(service: string, keyValue: string): Promise<boolean> {
    // Mock implementation for demo purposes
    console.log(`Testing ${service} API key: ${keyValue.substring(0, 5)}...`);
    return Math.random() > 0.2; // 80% chance of success
  }
  
  static async updateKeyStatus(keyId: string, userId: string, status: string): Promise<boolean> {
    // Mock implementation for demo purposes
    console.log(`Updating API key ${keyId} status to ${status}`);
    return true;
  }
  
  // Add missing method for getRandomServiceKey
  static async getRandomServiceKey(service: string): Promise<string | null> {
    console.log(`Getting random ${service} API key`);
    // Mock implementation - return a fake key
    if (service === 'jupiter') {
      return 'jp_mock_key_for_testing';
    }
    if (service === 'helius') {
      return 'hl_mock_key_for_testing';
    }
    return null;
  }
}
