import { supabase } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';

// Define the API key check result type
interface ApiKeyCheckResult {
  valid: boolean;
  service: string;
  message?: string;
}

// Define the check results type for multiple services
interface CheckResults {
  [service: string]: {
    total: number;
    working: number;
    notWorking: number;
    keys: ApiKeyCheckResult[];
  };
}

/**
 * Check if an API key is valid for a specific service
 */
export const checkApiKey = async (service: string, key: string): Promise<boolean> => {
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
      default:
        return false;
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
    
    if (!response.ok) {
      return false;
    }
    
    // Fix for the unknown index type issue
    const responseData = await response.json();
    
    // Check if responseData is an object
    if (responseData && typeof responseData === 'object') {
      // Safely access properties using optional chaining and type guards
      if (service.toLowerCase() === 'helius') {
        // For Helius, check if we got a valid response with tokens
        return Array.isArray(responseData.tokens);
      } else if (service.toLowerCase() === 'solana') {
        // For Solana RPC, check if result is "ok"
        return responseData.result === 'ok';
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Error checking ${service} API key:`, error);
    return false;
  }
};

/**
 * Check all API keys stored in the database
 */
export const checkAllApiKeys = async (): Promise<CheckResults> => {
  try {
    // Fetch all API keys from the database
    const { data: apiKeys, error } = await supabase
      .from('api_keys_storage')
      .select('*');
      
    if (error) throw error;
    
    if (!apiKeys || apiKeys.length === 0) {
      return {};
    }
    
    // Initialize results object
    const results: CheckResults = {};
    
    // Check each key
    for (const key of apiKeys) {
      const service = key.service;
      
      // Initialize service in results if it doesn't exist
      if (!results[service]) {
        results[service] = {
          total: 0,
          working: 0,
          notWorking: 0,
          keys: []
        };
      }
      
      results[service].total++;
      
      // Check if the key is valid
      const isValid = await checkApiKey(service, key.key_value);
      
      // Update results
      if (isValid) {
        results[service].working++;
      } else {
        results[service].notWorking++;
      }
      
      // Add key result
      results[service].keys.push({
        valid: isValid,
        service,
        message: isValid ? 'Key is valid' : 'Key is invalid'
      });
    }
    
    return results;
  } catch (error) {
    errorCollector.captureError(error as Error, {
      component: 'apiKeyChecker',
      source: 'checkAllApiKeys'
    });
    console.error('Error checking API keys:', error);
    return {};
  }
};

/**
 * Update the status of an API key in the database
 */
export const updateApiKeyStatus = async (keyId: string, status: 'active' | 'invalid' | 'expired'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('api_keys_storage')
      .update({ status })
      .eq('id', keyId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    errorCollector.captureError(error as Error, {
      component: 'apiKeyChecker',
      source: 'updateApiKeyStatus'
    });
    console.error('Error updating API key status:', error);
    return false;
  }
};
