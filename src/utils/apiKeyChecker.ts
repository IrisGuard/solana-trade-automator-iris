
import axios from 'axios';
import { toast } from 'sonner';

/**
 * Tests if a Helius API key is valid
 */
export async function testHeliusKey(apiKey: string): Promise<boolean> {
  try {
    // Use a simple request to test the key
    const response = await axios.get(
      `https://api.helius.xyz/v0/addresses/vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg/balances?api-key=${apiKey}`
    );
    
    return response.status === 200 && response.data && Array.isArray(response.data.tokens);
  } catch (error) {
    console.error('Error testing Helius API key:', error);
    return false;
  }
}

/**
 * Tests if a CoinGecko API key is valid
 */
export async function testCoinGeckoKey(apiKey: string): Promise<boolean> {
  try {
    // Use a simple request to test the key
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/ping?x_cg_pro_api_key=${apiKey}`
    );
    
    return response.status === 200;
  } catch (error) {
    console.error('Error testing CoinGecko API key:', error);
    return false;
  }
}

/**
 * Tests if a CryptoCompare API key is valid
 */
export async function testCryptoCompareKey(apiKey: string): Promise<boolean> {
  try {
    // Use a simple request to test the key
    const response = await axios.get(
      `https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&api_key=${apiKey}`
    );
    
    return response.status === 200 && response.data && response.data.USD;
  } catch (error) {
    console.error('Error testing CryptoCompare API key:', error);
    return false;
  }
}

/**
 * Tests multiple types of API keys
 */
export async function testApiKey(service: string, key: string): Promise<boolean> {
  try {
    if (!key || key.trim() === '') {
      return false;
    }
    
    switch (service.toLowerCase()) {
      case 'helius':
        return await testHeliusKey(key);
        
      case 'coingecko':
        return await testCoinGeckoKey(key);
        
      case 'cryptocompare':
        return await testCryptoCompareKey(key);
        
      default:
        console.warn(`No test implemented for service: ${service}`);
        return true; // Default to assuming it works if we don't have a specific test
    }
  } catch (error) {
    console.error(`Error testing ${service} API key:`, error);
    return false;
  }
}

/**
 * Tests all API keys of a specific service
 */
export async function testAllApiKeys(
  keys: { service: string; key: string; name: string }[]
): Promise<{ service: string; key: string; name: string; valid: boolean }[]> {
  const results = [];
  
  for (const keyInfo of keys) {
    try {
      const isValid = await testApiKey(keyInfo.service, keyInfo.key);
      results.push({
        ...keyInfo,
        valid: isValid
      });
    } catch (error) {
      console.error(`Error testing ${keyInfo.service} key ${keyInfo.name}:`, error);
      results.push({
        ...keyInfo,
        valid: false
      });
    }
  }
  
  return results;
}

/**
 * Displays a summary of API key test results
 */
export function showApiKeyTestResults(
  results: { service: string; name: string; valid: boolean }[]
): void {
  const servicesMap: Record<string, { total: number; valid: number; names: string[] }> = {};
  
  // Group results by service
  results.forEach(result => {
    if (!servicesMap[result.service]) {
      servicesMap[result.service] = { 
        total: 0, 
        valid: 0, 
        names: [] 
      };
    }
    
    servicesMap[result.service].total++;
    
    if (result.valid) {
      servicesMap[result.service].valid++;
      servicesMap[result.service].names.push(result.name);
    }
  });
  
  // Display results for each service
  Object.entries(servicesMap).forEach(([service, stats]) => {
    if (stats.valid === 0) {
      toast.error(`Κανένα έγκυρο κλειδί ${service}`);
    } else if (stats.valid < stats.total) {
      toast.warning(`${stats.valid}/${stats.total} κλειδιά ${service} είναι έγκυρα`);
    } else {
      toast.success(`Όλα τα κλειδιά ${service} είναι έγκυρα (${stats.valid})`);
    }
  });
}
