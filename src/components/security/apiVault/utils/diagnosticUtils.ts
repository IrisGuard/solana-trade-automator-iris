
import { ApiKey } from "../types";
import { toast } from "sonner";
import { DEFAULT_API_KEYS } from "@/components/wallet/api-vault/defaultApis";

// Function to scan all localStorage for potential API keys
export function diagnosticScanStorage(): string[] {
  const foundItems: string[] = [];
  
  try {
    // Scan all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value && (value.includes('"key":') || value.includes('apiKey') || value.includes('token'))) {
          foundItems.push(key);
        }
      }
    }
  } catch (e) {
    console.error('Error during storage scan:', e);
  }
  
  return foundItems;
}

// Function to extract all API keys from localStorage
export function extractAllKeysFromStorage(): ApiKey[] {
  const allKeys: ApiKey[] = [];
  const keyLocations = diagnosticScanStorage();
  
  keyLocations.forEach(location => {
    try {
      const data = localStorage.getItem(location);
      if (data) {
        // Try to parse as JSON
        try {
          const parsed = JSON.parse(data);
          
          // Check if it's an array of API keys
          if (Array.isArray(parsed)) {
            const validKeys = parsed.filter(item => 
              item && typeof item === 'object' && item.name && item.key && item.service
            );
            allKeys.push(...validKeys);
          }
          // Check if it's a single API key
          else if (parsed && typeof parsed === 'object' && parsed.name && parsed.key && parsed.service) {
            allKeys.push(parsed);
          }
        } catch (e) {
          // Not valid JSON, ignore
        }
      }
    } catch (e) {
      console.error(`Error extracting keys from ${location}:`, e);
    }
  });
  
  return allKeys;
}

// Function to inject demo API keys for testing
export function injectDemoKeys(count: number = 3): void {
  try {
    if (localStorage.getItem('demoKeysInjected') === 'true') {
      toast.warning('Demo keys were already injected');
      return;
    }
    
    const now = new Date().toISOString();
    const randomServices = ['solana', 'phantom', 'helius', 'quicknode', 'jupiter', 'solscan', 'vercel', 'supabase', 'openai', 'github'];
    const randomStatuses = ['active', 'expired', 'revoked', 'active', 'active'];
    
    const demoKeys: ApiKey[] = [];
    
    // Add some predefined demo keys
    demoKeys.push(...DEFAULT_API_KEYS);
    
    // Generate additional random keys
    for (let i = 0; i < count - DEFAULT_API_KEYS.length; i++) {
      const serviceIndex = Math.floor(Math.random() * randomServices.length);
      const statusIndex = Math.floor(Math.random() * randomStatuses.length);
      
      const service = randomServices[serviceIndex];
      
      demoKeys.push({
        id: `demo-${Date.now()}-${i}`,
        name: `${service.charAt(0).toUpperCase() + service.slice(1)} Demo Key ${i + 1}`,
        service: service,
        key: `demo-key-${service}-${Math.random().toString(36).substring(2, 10)}`,
        connected: Math.random() > 0.5,
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        status: randomStatuses[statusIndex] as 'active' | 'expired' | 'revoked'
      });
    }
    
    // Save current keys
    const existingKeysStr = localStorage.getItem('apiKeys');
    let existingKeys: ApiKey[] = [];
    
    if (existingKeysStr) {
      try {
        existingKeys = JSON.parse(existingKeysStr);
      } catch (e) {
        console.error('Error parsing existing keys:', e);
      }
    }
    
    // Merge keys
    const allKeys = [...existingKeys, ...demoKeys];
    localStorage.setItem('apiKeys', JSON.stringify(allKeys));
    localStorage.setItem('demoKeysInjected', 'true');
    
    toast.success(`Added ${demoKeys.length} demo keys successfully`);
    
    // Force a page reload to see the changes
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch (e) {
    console.error('Error injecting demo keys:', e);
    toast.error('Failed to inject demo keys');
  }
}
