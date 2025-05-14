
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { heliusKeyManager } from "@/services/solana/HeliusKeyManager";

/**
 * These are the demo API keys to be registered with the system.
 * Each key is dedicated to a specific type of Helius endpoint.
 */
export const HELIUS_API_KEYS = {
  // Standard API endpoints (RPC)
  mainnet_rpc: "ddb32813-1f4b-459d-8964-310b1b73a053",
  
  // API versions for different services
  api_v0: "ddb32813-1f4b-459d-8964-310b1b73a053",
  
  // Additional endpoint types
  eclipse: "",
  
  // WebSocket endpoints
  websocket: "ddb32813-1f4b-459d-8964-310b1b73a053"
};

// Helius API endpoints configuration
export const HELIUS_ENDPOINTS = {
  // Standard RPC endpoint
  rpc: "https://mainnet.helius-rpc.com/?api-key=",
  
  // API v0 endpoints (enhanced transaction info)
  api_v0_transactions: "https://api.helius.xyz/v0/transactions/?api-key=",
  api_v0_addresses: "https://api.helius.xyz/v0/addresses/{address}/transactions/?api-key=",
  
  // Eclipse endpoint
  eclipse: "https://eclipse.helius-rpc.com/",
  
  // WebSocket
  websocket: "wss://mainnet.helius-rpc.com/?api-key="
};

/**
 * Registers all available Helius API keys with the system
 * @param userId The ID of the user registering the keys
 * @returns True if successful, false otherwise
 */
export const registerHeliusApiKeys = async (userId: string): Promise<boolean> => {
  try {
    const results = await Promise.all([
      registerMainnetRpcKey(userId),
      registerApiV0Key(userId),
      registerWebSocketKey(userId)
    ]);
    
    // Initialize the key manager after registration
    await heliusKeyManager.initialize();
    
    const successCount = results.filter(result => result).length;
    if (successCount > 0) {
      toast.success(`Επιτυχής προσθήκη ${successCount} κλειδιών Helius`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Σφάλμα κατά την προσθήκη των κλειδιών Helius:', error);
    toast.error('Σφάλμα κατά την προσθήκη των κλειδιών Helius');
    return false;
  }
};

/**
 * Register the Helius Mainnet RPC key
 */
const registerMainnetRpcKey = async (userId: string): Promise<boolean> => {
  if (!HELIUS_API_KEYS.mainnet_rpc) return false;
  
  try {
    // Check if key already exists
    const { data: existingKeys, error: checkError } = await supabase
      .from('api_keys_storage')
      .select('*')
      .eq('key_value', HELIUS_API_KEYS.mainnet_rpc)
      .eq('service', 'helius-rpc');
    
    if (checkError) throw checkError;
    
    if (existingKeys && existingKeys.length > 0) {
      console.log('RPC key already exists');
      return true;
    }
    
    // Insert the key
    const { error } = await supabase
      .from('api_keys_storage')
      .insert({
        name: "Helius Mainnet RPC",
        key_value: HELIUS_API_KEYS.mainnet_rpc,
        service: "helius-rpc",
        description: "Standard mainnet RPC endpoint",
        status: "active",
        user_id: userId,
        is_encrypted: false
      });
      
    if (error) throw error;
    
    console.log('Successfully added Helius Mainnet RPC key');
    return true;
  } catch (error) {
    console.error('Error adding Helius Mainnet RPC key:', error);
    return false;
  }
};

/**
 * Register the Helius API v0 key
 */
const registerApiV0Key = async (userId: string): Promise<boolean> => {
  if (!HELIUS_API_KEYS.api_v0) return false;
  
  try {
    // Check if key already exists
    const { data: existingKeys, error: checkError } = await supabase
      .from('api_keys_storage')
      .select('*')
      .eq('key_value', HELIUS_API_KEYS.api_v0)
      .eq('service', 'helius-api-v0');
    
    if (checkError) throw checkError;
    
    if (existingKeys && existingKeys.length > 0) {
      console.log('API v0 key already exists');
      return true;
    }
    
    // Insert the key
    const { error } = await supabase
      .from('api_keys_storage')
      .insert({
        name: "Helius API v0",
        key_value: HELIUS_API_KEYS.api_v0,
        service: "helius-api-v0",
        description: "Enhanced transaction data API",
        status: "active",
        user_id: userId,
        is_encrypted: false
      });
      
    if (error) throw error;
    
    console.log('Successfully added Helius API v0 key');
    return true;
  } catch (error) {
    console.error('Error adding Helius API v0 key:', error);
    return false;
  }
};

/**
 * Register the Helius WebSocket key
 */
const registerWebSocketKey = async (userId: string): Promise<boolean> => {
  if (!HELIUS_API_KEYS.websocket) return false;
  
  try {
    // Check if key already exists
    const { data: existingKeys, error: checkError } = await supabase
      .from('api_keys_storage')
      .select('*')
      .eq('key_value', HELIUS_API_KEYS.websocket)
      .eq('service', 'helius-websocket');
    
    if (checkError) throw checkError;
    
    if (existingKeys && existingKeys.length > 0) {
      console.log('WebSocket key already exists');
      return true;
    }
    
    // Insert the key
    const { error } = await supabase
      .from('api_keys_storage')
      .insert({
        name: "Helius WebSocket",
        key_value: HELIUS_API_KEYS.websocket,
        service: "helius-websocket",
        description: "Real-time data via WebSocket",
        status: "active",
        user_id: userId,
        is_encrypted: false
      });
      
    if (error) throw error;
    
    console.log('Successfully added Helius WebSocket key');
    return true;
  } catch (error) {
    console.error('Error adding Helius WebSocket key:', error);
    return false;
  }
};

/**
 * Register API endpoints in Supabase for Helius
 */
export const registerHeliusEndpoints = async (): Promise<boolean> => {
  try {
    // Check if endpoints already exist
    const { data: existingEndpoints, error: checkError } = await supabase
      .from('api_endpoints')
      .select('*')
      .eq('category', 'helius');
    
    if (checkError) throw checkError;
    
    if (existingEndpoints && existingEndpoints.length > 5) {
      console.log('Helius endpoints already exist');
      return true;
    }
    
    // List of Helius endpoints to add
    const endpoints = [
      {
        name: "Helius Mainnet RPC",
        url: `${HELIUS_ENDPOINTS.rpc}${HELIUS_API_KEYS.mainnet_rpc}`,
        category: "helius",
        is_active: true,
        is_public: true
      },
      {
        name: "Helius API v0 Transactions",
        url: `${HELIUS_ENDPOINTS.api_v0_transactions}${HELIUS_API_KEYS.api_v0}`,
        category: "helius",
        is_active: true,
        is_public: true
      },
      {
        name: "Helius API v0 Address Transactions",
        url: `${HELIUS_ENDPOINTS.api_v0_addresses}${HELIUS_API_KEYS.api_v0}`,
        category: "helius",
        is_active: true,
        is_public: true
      },
      {
        name: "Helius Eclipse",
        url: HELIUS_ENDPOINTS.eclipse,
        category: "helius",
        is_active: true,
        is_public: true
      },
      {
        name: "Helius WebSocket",
        url: `${HELIUS_ENDPOINTS.websocket}${HELIUS_API_KEYS.websocket}`,
        category: "helius",
        is_active: true,
        is_public: true
      }
    ];
    
    // Add endpoints to database
    const { error } = await supabase
      .from('api_endpoints')
      .insert(endpoints);
      
    if (error) throw error;
    
    console.log('Successfully added Helius endpoints');
    return true;
  } catch (error) {
    console.error('Error adding Helius endpoints:', error);
    toast.error('Σφάλμα κατά την προσθήκη των endpoints Helius');
    return false;
  }
};
