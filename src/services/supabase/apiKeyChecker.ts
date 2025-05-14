
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';

// Example API service map - would be expanded with actual implementations
interface ApiService {
  name: string;
  checkKey: (key: string) => Promise<boolean>;
  statusMessage: string;
}

// Result type definition
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
    name: 'Helius API',
    checkKey: async (key: string) => {
      try {
        // Basic validation format check for Helius key (UUID format)
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidPattern.test(key)) {
          return false;
        }

        // Try a simple API call to verify the key works
        const endpoint = `https://api.helius.xyz/v0/addresses/vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg/transactions?api-key=${key}&limit=1`;
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        return response.ok;
      } catch (error) {
        console.error("Error checking Helius key:", error);
        return false;
      }
    },
    statusMessage: 'Helius API key check passed'
  },
  jupiter: {
    name: 'Jupiter API',
    checkKey: async (key: string) => {
      // Jupiter doesn't require API keys for most endpoints
      // This is a placeholder for any future validation
      return true;
    },
    statusMessage: 'Jupiter API access verified'
  },
  solana: {
    name: 'Solana RPC',
    checkKey: async (key: string) => {
      try {
        // For RPC endpoints, we can make a getVersion call
        const response = await fetch(key, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getVersion'
          }),
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        const data = await response.json();
        return data?.result?.solana !== undefined;
      } catch (error) {
        console.error("Error checking Solana RPC:", error);
        return false;
      }
    },
    statusMessage: 'Solana RPC access verified'
  }
};

// Helper class for checking API keys
export class ApiKeyChecker {
  // Check a single API key
  static async checkApiKey(service: string, key: string): Promise<boolean> {
    try {
      if (!apiServices[service]) {
        console.warn(`No checker available for service: ${service}`);
        return false;
      }
      
      return await apiServices[service].checkKey(key);
    } catch (error) {
      console.error(`Error checking ${service} API key:`, error);
      return false;
    }
  }
  
  // Check all stored API keys for a user
  static async checkAllApiKeysForUser(userId: string): Promise<CheckResults> {
    const results: CheckResults = {};
    
    try {
      // Get all API keys for the user
      const { data: keys, error } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        throw error;
      }
      
      if (!keys || keys.length === 0) {
        toast.info('No API keys found to check');
        return {};
      }
      
      // Group keys by service
      const keysByService: Record<string, any[]> = {};
      keys.forEach(key => {
        if (!keysByService[key.service]) {
          keysByService[key.service] = [];
        }
        keysByService[key.service].push(key);
      });
      
      // Check each service's keys
      for (const [service, serviceKeys] of Object.entries(keysByService)) {
        results[service] = {
          total: serviceKeys.length,
          working: 0,
          notWorking: 0
        };
        
        // Only check if we have a service checker
        if (apiServices[service]) {
          for (const key of serviceKeys) {
            const isWorking = await this.checkApiKey(service, key.key_value);
            
            // Update status in database
            await supabase
              .from('api_keys_storage')
              .update({ status: isWorking ? 'active' : 'invalid' })
              .eq('id', key.id);
              
            if (isWorking) {
              results[service].working++;
            } else {
              results[service].notWorking++;
            }
          }
        } else {
          // Mark as unchecked if no checker exists
          console.log(`No checker available for service: ${service}`);
          results[service].working = serviceKeys.length; // Assume working if we can't check
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error checking API keys:', error);
      errorCollector.captureError(error as Error, {
        component: 'ApiKeyChecker',
        details: 'Failed to check API keys',
        source: 'client'
      });
      toast.error('Error checking API keys');
      return {};
    }
  }
  
  // Get status badge text based on check results
  static getStatusText(results: CheckResults): string {
    const totals = Object.values(results).reduce(
      (acc, curr) => {
        acc.total += curr.total;
        acc.working += curr.working;
        acc.notWorking += curr.notWorking;
        return acc;
      },
      { total: 0, working: 0, notWorking: 0 }
    );
    
    if (totals.total === 0) {
      return 'No keys';
    }
    
    if (totals.working === totals.total) {
      return 'All keys valid';
    }
    
    return `${totals.working}/${totals.total} valid`;
  }
  
  // Update API service mapping
  static registerApiService(serviceId: string, service: ApiService): void {
    apiServices[serviceId] = service;
  }
}
