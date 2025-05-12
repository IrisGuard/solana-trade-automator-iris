
import { toast } from "sonner";
import { ApiKey } from "./types";
import { solanaService } from "@/services/solana";

// Service for testing API connections and validating keys
export const ApiIntegrationService = {
  // Test the connection for a specific API key
  testConnection: async (apiKey: ApiKey): Promise<boolean> => {
    try {
      switch (apiKey.service.toLowerCase()) {
        case 'solana':
        case 'solarpc':
          // Test Solana RPC connection
          return await testSolanaRPC(apiKey.key);
        case 'phantom':
          // Test if Phantom is installed
          return !!window.solana?.isPhantom;
        case 'solscan':
          // Test Solscan API
          return await testSolscanAPI(apiKey.key);
        case 'jupiter':
          // Test Jupiter API
          return await testJupiterAPI(apiKey.key);
        case 'helius':
          // Test Helius API
          return await testHeliusAPI(apiKey.key);
        case 'quicknode':
          // Test QuickNode API
          return await testQuickNodeAPI(apiKey.key);
        default:
          // For other APIs, just check if the key format seems valid
          return validateKeyFormat(apiKey.key, apiKey.service);
      }
    } catch (error) {
      console.error(`Error testing connection for ${apiKey.service}:`, error);
      return false;
    }
  },

  // Get service-specific key format requirements
  getKeyPatternForService: (service: string): RegExp | null => {
    const patterns: Record<string, RegExp> = {
      'solana': /^[a-zA-Z0-9]+$/,
      'phantom': /^[a-zA-Z0-9]+$/,
      'supabase': /^eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/,
      'openai': /^sk-[a-zA-Z0-9]{32,}$/,
      'stripe': /^(pk|sk|rk)_(test|live)_[a-zA-Z0-9]+$/,
      'github': /^gh[a-z]_[a-zA-Z0-9]+$/,
      'helius': /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/
    };
    
    return patterns[service.toLowerCase()] || null;
  },

  // Detect service type from key format
  detectServiceFromKey: (key: string): string | null => {
    if (/^eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/.test(key)) {
      return 'supabase';
    }
    if (/^sk-[a-zA-Z0-9]{32,}$/.test(key)) {
      return 'openai';
    }
    if (/^(pk|sk|rk)_(test|live)_[a-zA-Z0-9]+$/.test(key)) {
      return 'stripe';
    }
    if (/^gh[a-z]_[a-zA-Z0-9]+$/.test(key)) {
      return 'github';
    }
    if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(key)) {
      return 'helius';
    }
    return null;
  },

  // Get example key for a service
  getExampleKeyForService: (service: string): string => {
    const examples: Record<string, string> = {
      'solana': 'https://api.mainnet-beta.solana.com',
      'phantom': 'Connect through browser extension',
      'supabase': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      'openai': 'sk-abcdefghijklmnopqrstuvwxyz123456',
      'stripe': 'sk_test_51Abc123Def456Ghi789Jkl',
      'github': 'ghp_abcdefghijklmnopqrstuvwxyz123456',
      'solscan': 'https://public-api.solscan.io/',
      'jupiter': 'https://quote-api.jup.ag/v4',
      'helius': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'quicknode': 'https://xxxxxx.solana-mainnet.quiknode.pro/xxxxxxxxxx/'
    };
    
    return examples[service.toLowerCase()] || 'API key format depends on service';
  }
};

// Helper functions for testing specific services
async function testSolanaRPC(endpoint: string): Promise<boolean> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getHealth',
      }),
    });
    const data = await response.json();
    return data.result === 'ok' || data.result === null;
  } catch (error) {
    console.error('Error testing Solana RPC:', error);
    return false;
  }
}

async function testSolscanAPI(key: string): Promise<boolean> {
  try {
    // Try to get data for a well-known Solana address
    const endpoint = 'https://public-api.solscan.io/account/vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg';
    const headers = key ? { 'token': key } : {};
    
    const response = await fetch(endpoint, { headers });
    return response.ok;
  } catch (error) {
    console.error('Error testing Solscan API:', error);
    return false;
  }
}

async function testJupiterAPI(key: string): Promise<boolean> {
  try {
    // Jupiter doesn't require authentication for quotes, so we can just test the API
    const response = await fetch('https://quote-api.jup.ag/v4/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=100000000');
    return response.ok;
  } catch (error) {
    console.error('Error testing Jupiter API:', error);
    return false;
  }
}

async function testHeliusAPI(key: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.helius.xyz/v0/addresses/vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg/transactions?api-key=${key}`);
    return response.ok;
  } catch (error) {
    console.error('Error testing Helius API:', error);
    return false;
  }
}

async function testQuickNodeAPI(key: string): Promise<boolean> {
  try {
    // QuickNode uses custom endpoints, we'll just verify the format
    return key.includes('quiknode') || key.includes('quicknode');
  } catch (error) {
    console.error('Error testing QuickNode API:', error);
    return false;
  }
}

function validateKeyFormat(key: string, service: string): boolean {
  const pattern = ApiIntegrationService.getKeyPatternForService(service);
  return pattern ? pattern.test(key) : true;
}

