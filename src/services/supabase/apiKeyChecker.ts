import { dbClient } from '@/integrations/supabase/client';

// Define the structure for API service details
interface ApiService {
  name: string;
  testEndpoint: string;
  testMethod: string;
  testParams: any[];
  responseKey?: string;
  successValue?: any;
}

// Define the structure for API key check results
interface CheckResults {
  [service: string]: {
    total: number;
    working: number;
    notWorking: number;
  };
}

// Map of available API services by service ID
const apiServices: Record<string, ApiService> = {
  helius: {
    name: 'Helius',
    testEndpoint: 'enhanced-transactions',
    testMethod: 'getEnhancedTransactions',
    testParams: [{
      transactionHashes: ["5werj5j6wtP8y6DmbMeE5Xqfg89Q93o579n3Yj4tX6G9w75jC9ac2vTvqYFGJvBsjEqeTGhho8jNeJ9zafaVeqS"]
    }],
    responseKey: 'result',
    successValue: null
  },
  // Add other services here as needed
};

// API Key Checker class
export class ApiKeyChecker {
  
  // Test a specific API key
  static async testApiKey(service: string, key: string): Promise<boolean> {
    const serviceConfig = apiServices[service];
    
    if (!serviceConfig) {
      console.warn(`Service ${service} not found in API configurations.`);
      return false;
    }
    
    try {
      const url = `https://api.helius.xyz/v0/${serviceConfig.testEndpoint}?api-key=${key}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: serviceConfig.testMethod,
          params: serviceConfig.testParams
        })
      });
      
      if (!response.ok) {
        console.error(`API key test failed for ${service} with status: ${response.status}`);
        return false;
      }
      
      const data = await response.json();
      
      if (serviceConfig.responseKey) {
        // Check if the response contains the expected key
        if (data && data[serviceConfig.responseKey] !== undefined) {
          return true;
        } else {
          console.error(`Response does not contain expected key: ${serviceConfig.responseKey}`);
          return false;
        }
      } else if (serviceConfig.successValue !== undefined) {
        // Compare the entire response with the expected success value
        return data === serviceConfig.successValue;
      } else {
        // If no specific checks are defined, consider it a success
        return true;
      }
    } catch (error) {
      console.error(`Error testing API key for ${service}:`, error);
      return false;
    }
  }
  
  // Check individual key
  static async checkApiKey(keyId: string, service: string, keyValue: string): Promise<boolean> {
    try {
      const isValid = await this.testApiKey(service, keyValue);
      
      if (isValid) {
        await this.updateKeyStatus(keyId, 'active');
        return true;
      } else {
        await this.updateKeyStatus(keyId, 'failing', 'API key test failed');
        return false;
      }
    } catch (error) {
      console.error('Error checking API key:', error);
      await this.updateKeyStatus(keyId, 'failing', 'API key check error');
      return false;
    }
  }
  
  // Check all stored API keys for a user
  static async checkAllApiKeysForUser(userId: string): Promise<CheckResults> {
    const results: CheckResults = {};
    
    try {
      // Get all API keys for the user
      const { data: keys, error } = await dbClient
        .from('api_keys_storage')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      if (!keys || keys.length === 0) {
        return results;
      }
      
      // Initialize results object with service categories
      const serviceCategories = [...new Set(keys.map(key => key.service))];
      serviceCategories.forEach(service => {
        results[service] = {
          total: 0,
          working: 0,
          notWorking: 0
        };
      });
      
      // Check each key
      for (const key of keys) {
        const service = key.service;
        results[service].total++;
        
        const isWorking = await this.checkApiKey(key.id, service, key.key_value);
        
        if (isWorking) {
          results[service].working++;
        } else {
          results[service].notWorking++;
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error checking API keys:', error);
      return results;
    }
  }
  
  // Update API key status in database
  static async updateKeyStatus(keyId: string, status: string, statusMessage?: string) {
    try {
      const updates: { status: string; status_message?: string } = { status };
      
      if (statusMessage) {
        updates.status_message = statusMessage;
      }
      
      const { error } = await dbClient
        .from('api_keys_storage')
        .update(updates)
        .eq('id', keyId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating key status:', error);
      return false;
    }
  }
  
  // Get status badge text based on check results
  static getStatusText(results: CheckResults): string {
    const totals = Object.values(results).reduce(
      (acc, curr) => {
        acc.total += curr.total;
        acc.working += curr.working;
        return acc;
      },
      { total: 0, working: 0 }
    );
    
    if (totals.total === 0) return "No API keys";
    if (totals.working === 0) return "All keys failing";
    if (totals.working < totals.total) return `${totals.working}/${totals.total} keys working`;
    return "All keys working";
  }
}
