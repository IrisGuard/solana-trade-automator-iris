
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { heliusKeyManager } from '@/services/helius/HeliusKeyManager';
import { heliusService } from '@/services/helius/HeliusService';

/**
 * Initializes system-level API keys that don't require user authentication
 * This approach adds endpoints which will be accessible to all users
 */
export async function initializeSystemApiKeys(): Promise<boolean> {
  try {
    // First, add the API endpoints (these don't require a user association)
    const endpointsToAdd = [
      {
        name: 'Helius Enhanced Transactions',
        url: 'https://api.helius.xyz/v0/transactions?api-key={API_KEY}',
        category: 'helius',
        is_active: true,
        is_public: true
      },
      {
        name: 'Helius Name Service',
        url: 'https://api.helius.xyz/v0/addresses/{address}/names?api-key={API_KEY}',
        category: 'helius',
        is_active: true,
        is_public: true
      },
      {
        name: 'Helius Token Balances',
        url: 'https://api.helius.xyz/v0/addresses/{address}/balances?api-key={API_KEY}',
        category: 'helius',
        is_active: true,
        is_public: true
      },
      {
        name: 'CoinGecko Price API',
        url: 'https://api.coingecko.com/api/v3/simple/price?ids={coin_ids}&vs_currencies={currencies}&include_24hr_change=true',
        category: 'price',
        is_active: true,
        is_public: true
      },
      {
        name: 'CryptoCompare Multi Price',
        url: 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms={symbols}&tsyms={currencies}&api_key={API_KEY}',
        category: 'price',
        is_active: true,
        is_public: true
      },
      {
        name: 'Solana Mainnet RPC',
        url: 'https://api.mainnet-beta.solana.com',
        category: 'solana',
        is_active: true,
        is_public: true
      },
      {
        name: 'GenesysGo RPC',
        url: 'https://ssc-dao.genesysgo.net',
        category: 'solana',
        is_active: true,
        is_public: true
      }
    ];

    // Add each endpoint, skipping any that might already exist
    for (const endpoint of endpointsToAdd) {
      const { error } = await supabase
        .from('api_endpoints')
        .insert(endpoint)
        .select()
        .maybeSingle();
      
      if (error && !error.message.includes('duplicate')) {
        console.error(`Error adding endpoint ${endpoint.name}:`, error);
      }
    }

    console.log('API endpoints initialized');
    return true;
  } catch (error) {
    console.error('Error initializing system API keys:', error);
    toast.error('Σφάλμα κατά την αρχικοποίηση των κλειδιών API');
    return false;
  }
}

/**
 * Adds Helius API keys for a specific user
 */
export async function addHeliusKeysForUser(userId: string): Promise<boolean> {
  if (!userId) {
    console.error('User ID is required to add Helius keys');
    return false;
  }

  try {
    // Check if user already has Helius keys
    const { data: existingKeys } = await supabase
      .from('api_keys_storage')
      .select('*')
      .eq('user_id', userId)
      .eq('service', 'helius');

    if (existingKeys && existingKeys.length > 0) {
      console.log('User already has Helius keys, skipping');
      return true;
    }

    // Add the Helius API keys
    const heliusKeys = [
      {
        id: uuidv4(),
        name: 'Helius Primary API',
        service: 'helius',
        key_value: '50c1e773-6444-458a-b40b-9d4f9981b8cd',
        description: 'Primary Helius API key for enhanced transactions',
        status: 'active',
        user_id: userId,
        is_encrypted: false
      },
      {
        id: uuidv4(),
        name: 'Helius DAS API',
        service: 'helius',
        key_value: 'ddb32813-1f4b-459d-8964-310b1b73a053',
        description: 'Helius DAS API for Digital Asset Standard',
        status: 'active',
        user_id: userId,
        is_encrypted: false
      }
    ];

    for (const key of heliusKeys) {
      const { error } = await supabase
        .from('api_keys_storage')
        .insert(key);
      
      if (error) {
        console.error(`Error adding Helius key ${key.name}:`, error);
        return false;
      }
    }

    // Add price API keys
    const priceKeys = [
      {
        id: uuidv4(),
        name: 'CoinGecko API',
        service: 'coingecko',
        key_value: 'CG-z5LtWHMxpZNT7XzdmzMwTa5D',
        description: 'CoinGecko API for cryptocurrency prices',
        status: 'active',
        user_id: userId,
        is_encrypted: false
      },
      {
        id: uuidv4(),
        name: 'CryptoCompare API',
        service: 'cryptocompare',
        key_value: '359b40aa9c1a38a19da595cc5573a7c92d2f0c43a2c34564d2749520481b9f2d',
        description: 'CryptoCompare API for market data',
        status: 'active',
        user_id: userId,
        is_encrypted: false
      }
    ];

    for (const key of priceKeys) {
      const { error } = await supabase
        .from('api_keys_storage')
        .insert(key);
      
      if (error) {
        console.error(`Error adding price key ${key.name}:`, error);
      }
    }

    // Refresh Helius service so it uses the new keys
    await heliusKeyManager.forceReload();
    await heliusService.reinitialize();

    toast.success('Κλειδιά Helius προστέθηκαν επιτυχώς');
    return true;
  } catch (error) {
    console.error('Error adding Helius keys:', error);
    toast.error('Σφάλμα κατά την προσθήκη των κλειδιών Helius');
    return false;
  }
}
