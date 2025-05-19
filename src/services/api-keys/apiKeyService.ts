import { supabase } from '@/integrations/supabase/client';
import { ApiKeyEntry, ApiKeyWithState } from './types';
import { errorCollector } from '@/utils/error-handling/collector';
import { v4 as uuidv4 } from 'uuid';

/**
 * Unified API key service for fetching, saving, testing, and managing API keys
 */
export class ApiKeyService {
  /**
   * Fetch API keys from Supabase for the specified user
   */
  static async fetchUserApiKeys(userId: string): Promise<ApiKeyWithState[]> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        name: item.name,
        service: item.service,
        key_value: item.key_value,
        status: item.status as ApiKeyEntry['status'],
        created_at: item.created_at,
        description: item.description || '',
        is_encrypted: item.is_encrypted || false,
        isVisible: false,
        isWorking: item.status === 'active',
        isTesting: false
      }));
    } catch (error) {
      errorCollector.captureError(error as Error, {
        component: 'ApiKeyService',
        source: 'fetchUserApiKeys'
      });
      throw error;
    }
  }
  
  /**
   * Check if an API key is valid for a specific service
   */
  static async testApiKey(service: string, key: string): Promise<boolean> {
    try {
      let endpoint = '';
      let headers: Record<string, string> = {};
      let method = 'GET';
      
      // Configure request based on service
      switch (service.toLowerCase()) {
        case 'helius':
          endpoint = `https://api.helius.xyz/v0/addresses/vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg/balances?api-key=${key}`;
          break;
        case 'solana':
          endpoint = 'https://api.mainnet-beta.solana.com';
          method = 'POST';
          headers = {
            'Content-Type': 'application/json'
          };
          break;
        case 'birdeye':
          endpoint = 'https://public-api.birdeye.so/v2/defi/version';
          headers = {
            'X-API-KEY': key
          };
          break;
        default:
          console.log(`No test endpoint defined for service ${service}`);
          // For unknown services, return true as we can't test them
          return true;
      }
      
      // Make the request
      const response = await fetch(endpoint, {
        method,
        headers,
        body: method === 'POST' ? JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getHealth',
        }) : undefined
      });
      
      // If response is not ok, key is invalid
      if (!response.ok) {
        return false;
      }
      
      try {
        const responseData = await response.json();
        
        // Service-specific validation logic
        if (service.toLowerCase() === 'helius') {
          return Array.isArray(responseData.tokens);
        } else if (service.toLowerCase() === 'solana') {
          return responseData.result === 'ok';
        } else if (service.toLowerCase() === 'birdeye') {
          return responseData && !responseData.error;
        }
        
        // Default to true if we got a valid response
        return true;
      } catch (parseError) {
        console.error(`Error parsing ${service} API key response:`, parseError);
        return false;
      }
    } catch (error) {
      console.error(`Error testing ${service} API key:`, error);
      return false;
    }
  }

  /**
   * Save a single API key to Supabase
   */
  static async saveApiKey(key: ApiKeyEntry): Promise<ApiKeyEntry | null> {
    try {
      if (!key.user_id) {
        throw new Error('User ID is required');
      }
      
      // Use provided ID or generate a new one
      const keyToSave = {
        id: key.id || uuidv4(),
        user_id: key.user_id,
        name: key.name,
        service: key.service,
        key_value: key.key_value,
        status: (key.status || 'active') as ApiKeyEntry['status'],
        description: key.description || '',
        is_encrypted: key.is_encrypted || false,
        created_at: key.created_at || new Date().toISOString()
      };
      
      // Determine if we need to insert or update
      if (key.id) {
        // Update existing key
        const { data, error } = await supabase
          .from('api_keys_storage')
          .update({
            name: keyToSave.name,
            service: keyToSave.service,
            key_value: keyToSave.key_value,
            status: keyToSave.status,
            description: keyToSave.description,
            is_encrypted: keyToSave.is_encrypted
          })
          .eq('id', keyToSave.id)
          .eq('user_id', keyToSave.user_id)
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          // Ensure the returned data has the correct type for status
          return {
            ...data[0],
            status: data[0].status as ApiKeyEntry['status']
          };
        }
        return null;
      } else {
        // Insert new key
        const { data, error } = await supabase
          .from('api_keys_storage')
          .insert(keyToSave)
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          // Ensure the returned data has the correct type for status
          return {
            ...data[0],
            status: data[0].status as ApiKeyEntry['status']
          };
        }
        return null;
      }
    } catch (error) {
      errorCollector.captureError(error as Error, {
        component: 'ApiKeyService',
        source: 'saveApiKey'
      });
      throw error;
    }
  }

  /**
   * Update API key status
   */
  static async updateKeyStatus(
    keyId: string,
    userId: string,
    status: 'active' | 'expired' | 'revoked' | 'failing'
  ): Promise<boolean> {
    try {
      if (!keyId || !userId) {
        throw new Error('Key ID and User ID are required');
      }
      
      const { error } = await supabase
        .from('api_keys_storage')
        .update({ status })
        .eq('id', keyId)
        .eq('user_id', userId);
        
      if (error) throw error;
      return true;
    } catch (error) {
      errorCollector.captureError(error as Error, {
        component: 'ApiKeyService',
        source: 'updateKeyStatus'
      });
      return false;
    }
  }

  /**
   * Delete API key
   */
  static async deleteApiKey(keyId: string, userId: string): Promise<boolean> {
    try {
      if (!keyId || !userId) {
        throw new Error('Key ID and User ID are required');
      }
      
      const { error } = await supabase
        .from('api_keys_storage')
        .delete()
        .eq('id', keyId)
        .eq('user_id', userId);
        
      if (error) throw error;
      return true;
    } catch (error) {
      errorCollector.captureError(error as Error, {
        component: 'ApiKeyService',
        source: 'deleteApiKey'
      });
      return false;
    }
  }

  /**
   * Get available API keys for a specific service
   */
  static async getServiceKeys(service: string, userId?: string): Promise<string[]> {
    try {
      let query = supabase
        .from('api_keys_storage')
        .select('key_value')
        .eq('service', service.toLowerCase())
        .eq('status', 'active');
        
      // If userId is provided, filter by user
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data || []).map(item => item.key_value).filter(Boolean);
    } catch (error) {
      errorCollector.captureError(error as Error, {
        component: 'ApiKeyService',
        source: 'getServiceKeys'
      });
      return [];
    }
  }

  /**
   * Get a random API key for a service (for load balancing)
   */
  static async getRandomServiceKey(service: string, userId?: string): Promise<string | null> {
    try {
      const keys = await this.getServiceKeys(service, userId);
      
      if (keys.length === 0) {
        return null;
      }
      
      // Get a random key
      const randomIndex = Math.floor(Math.random() * keys.length);
      return keys[randomIndex];
    } catch (error) {
      console.error(`Error getting random ${service} key:`, error);
      return null;
    }
  }
}
