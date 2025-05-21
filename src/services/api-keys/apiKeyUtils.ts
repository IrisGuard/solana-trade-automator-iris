
import { v4 as uuidv4 } from 'uuid';
import { ApiKeyEntry, ApiService } from './types';
import { errorCollector } from '@/utils/error-handling/collector';

// API key validation functions
export function isValidApiKey(key: string, service?: string): boolean {
  if (!key || key.length < 10) {
    return false;
  }
  
  // Service-specific validation
  if (service) {
    switch (service.toLowerCase()) {
      case 'helius':
        // UUID format validation for Helius keys
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key);
      case 'openai':
        // OpenAI API key format
        return /^sk-[A-Za-z0-9]{32,}$/.test(key);
      case 'solana':
        // Solana wallet addresses or keys
        return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(key);
      default:
        // Default validation - at least 16 chars, no spaces
        return key.length >= 16 && !/\s/.test(key);
    }
  }
  
  // Generic validation for unknown service types
  return key.length >= 16 && !/\s/.test(key);
}

export function detectServiceFromKey(key: string): string | null {
  try {
    if (!key) return null;
    
    // Service-specific patterns
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key)) {
      return 'helius';
    }
    
    if (/^sk-[A-Za-z0-9]{32,}$/.test(key)) {
      return 'openai';
    }
    
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(key) && !key.includes('-')) {
      return 'solana';
    }
    
    if (/^ghp_[A-Za-z0-9]{36}$/.test(key)) {
      return 'github';
    }
    
    // For unknown patterns
    return null;
  } catch (error) {
    errorCollector.captureError(error instanceof Error ? error : new Error('Failed to detect service from key'), {
      component: 'apiKeyUtils',
      source: 'detectServiceFromKey'
    });
    return null;
  }
}

export function generateApiKeyEntry(
  name: string,
  service: string,
  keyValue: string,
  options: {
    userId?: string;
    description?: string;
    isEncrypted?: boolean;
  } = {}
): ApiKeyEntry {
  try {
    return {
      id: uuidv4(),
      user_id: options.userId || 'anonymous',
      name,
      service,
      key_value: keyValue,
      status: 'active',
      created_at: new Date().toISOString(),
      description: options.description,
      is_encrypted: options.isEncrypted
    };
  } catch (error) {
    errorCollector.captureError(error instanceof Error ? error : new Error('Failed to generate API key entry'), {
      component: 'apiKeyUtils',
      source: 'generateApiKeyEntry'
    });
    throw error;
  }
}

// List of common API services
export const API_SERVICES: ApiService[] = [
  {
    id: 'helius',
    name: 'Helius',
    description: 'Solana blockchain data API',
    documentationUrl: 'https://docs.helius.xyz/',
    apiKeyUrl: 'https://dev.helius.xyz/dashboard/app',
    endpoint: 'https://api.helius.xyz/v0',
    isActive: true
  },
  {
    id: 'solana',
    name: 'Solana',
    description: 'Solana blockchain wallet keys and RPC',
    documentationUrl: 'https://docs.solana.com/',
    apiKeyUrl: 'https://solana.com/',
    endpoint: 'https://api.mainnet-beta.solana.com',
    isActive: true
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'AI models and GPT API',
    documentationUrl: 'https://platform.openai.com/docs/',
    apiKeyUrl: 'https://platform.openai.com/account/api-keys',
    endpoint: 'https://api.openai.com/v1',
    isActive: true
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'GitHub API access',
    documentationUrl: 'https://docs.github.com/en/rest',
    apiKeyUrl: 'https://github.com/settings/tokens',
    endpoint: 'https://api.github.com',
    isActive: true
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Custom or other API service',
    documentationUrl: '',
    apiKeyUrl: '',
    endpoint: '',
    isActive: false
  }
];
