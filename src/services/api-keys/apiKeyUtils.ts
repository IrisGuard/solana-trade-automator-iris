
import { ApiKeyEntry } from './types';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';

/**
 * Function to test if a Helius API key is valid
 */
export async function testHeliusApiKey(keyValue: string): Promise<boolean> {
  try {
    // Test endpoint for Helius API
    const url = `https://api.helius.xyz/v0/transactions?api-key=${keyValue}`;
    
    // Simple test transaction to check
    const testPayload = {
      transactions: ["5werj5j6wtP8y6DmbMeE5Xqfg89Q93o579n3Yj4tX6G9w75jC9ac2vTvqYFGJvBsjEqeTGhho8jNeJ9zafaVeqS"]
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return Array.isArray(data) && data.length > 0;
  } catch (error) {
    console.error('Error testing Helius API key:', error);
    errorCollector.captureError(error instanceof Error ? error : new Error(String(error)), {
      component: 'apiKeyUtils',
      source: 'testHeliusApiKey',
      severity: 'medium'
    });
    return false;
  }
}

/**
 * Function to test any API key based on service type
 */
export async function testApiKey(service: string, keyValue: string): Promise<boolean> {
  try {
    // Normalize service name
    const normalizedService = service.toLowerCase().trim();
    
    // Use specific test functions based on service
    if (normalizedService.includes('helius')) {
      return await testHeliusApiKey(keyValue);
    }
    
    // Add other service testers here
    
    // Default simple validation for unknown services
    return keyValue.length >= 16;
  } catch (error) {
    console.error('Error testing API key:', error);
    errorCollector.captureError(error instanceof Error ? error : new Error(String(error)), {
      component: 'apiKeyUtils',
      source: 'testApiKey',
      severity: 'medium'
    });
    return false;
  }
}

/**
 * Hash an API key for secure storage
 * Note: In a real implementation, this would use a server-side HMAC
 */
export function hashApiKey(key: string): string {
  // This is a simple hash for demo purposes
  // In production, use a proper HMAC on the server side
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * Categorize an API key based on metadata
 */
export function categorizeApiKey(key: ApiKeyEntry): {
  environment: 'production' | 'development' | 'backup',
  purpose: string
} {
  const name = (key.name || '').toLowerCase();
  const description = (key.description || '').toLowerCase();
  
  // Determine environment
  let environment: 'production' | 'development' | 'backup' = 'production';
  if (name.includes('dev') || name.includes('test') || description.includes('dev') || description.includes('test')) {
    environment = 'development';
  } else if (name.includes('backup') || description.includes('backup') || description.includes('emergency')) {
    environment = 'backup';
  }
  
  // Determine purpose
  let purpose = 'general';
  if (name.includes('transaction') || description.includes('transaction')) {
    purpose = 'transactions';
  } else if (name.includes('nft') || description.includes('nft')) {
    purpose = 'nft';
  } else if (name.includes('asset') || description.includes('asset')) {
    purpose = 'asset';
  }
  
  return { environment, purpose };
}
