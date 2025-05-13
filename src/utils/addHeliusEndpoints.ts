
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Τα endpoints του Helius που πρέπει να προστεθούν
const HELIUS_ENDPOINTS = [
  {
    name: "HELIUS_RPC_MAINNET",
    url: "https://mainnet.helius-rpc.com/?api-key=ddb32813-1f4b-459d-8964-310b1b73a053",
    category: "solana"
  },
  {
    name: "HELIUS_ECLIPSE",
    url: "https://eclipse.helius-rpc.com/",
    category: "solana"
  },
  {
    name: "HELIUS_WEBSOCKET",
    url: "wss://mainnet.helius-rpc.com/?api-key=ddb32813-1f4b-459d-8964-310b1b73a053",
    category: "solana"
  },
  {
    name: "HELIUS_API_TRANSACTIONS",
    url: "https://api.helius.xyz/v0/transactions/?api-key=ddb32813-1f4b-459d-8964-310b1b73a053",
    category: "solana"
  },
  {
    name: "HELIUS_API_ADDRESS_TRANSACTIONS",
    url: "https://api.helius.xyz/v0/addresses/{address}/transactions/?api-key=ddb32813-1f4b-459d-8964-310b1b73a053",
    category: "solana"
  }
];

// Συνάρτηση για προσθήκη των endpoints στη βάση δεδομένων
export async function addHeliusEndpoints() {
  try {
    // Έλεγχος για υπάρχοντα endpoints με αυτά τα ονόματα
    const { data: existingEndpoints } = await supabase
      .from('api_endpoints')
      .select('name')
      .in('name', HELIUS_ENDPOINTS.map(ep => ep.name));
    
    const existingNames = existingEndpoints?.map(ep => ep.name) || [];
    
    // Φιλτράρισμα νέων endpoints
    const newEndpoints = HELIUS_ENDPOINTS.filter(ep => !existingNames.includes(ep.name));
    
    if (newEndpoints.length === 0) {
      toast.info('Όλα τα Helius endpoints υπάρχουν ήδη στη βάση δεδομένων');
      return [];
    }
    
    // Προσθήκη νέων endpoints
    const { data, error } = await supabase
      .from('api_endpoints')
      .insert(newEndpoints.map(ep => ({
        name: ep.name,
        url: ep.url,
        category: ep.category,
        is_active: true,
        is_public: true
      })))
      .select();
    
    if (error) {
      throw error;
    }
    
    toast.success(`Προστέθηκαν ${newEndpoints.length} νέα Helius endpoints`);
    return data;
  } catch (error) {
    console.error('Error adding Helius endpoints:', error);
    toast.error('Σφάλμα κατά την προσθήκη των Helius endpoints');
    return [];
  }
}

// Συνάρτηση για την προσθήκη του κλειδιού Helius στην κλειδοθήκη
export async function addHeliusKey(userId: string) {
  try {
    // Έλεγχος αν υπάρχει ήδη το κλειδί
    const { data: existingKeys } = await supabase
      .from('api_keys_storage')
      .select('*')
      .eq('service', 'helius')
      .eq('user_id', userId);
    
    if (existingKeys && existingKeys.length > 0) {
      toast.info('Το κλειδί Helius υπάρχει ήδη στην κλειδοθήκη');
      return null;
    }
    
    // Προσθήκη του κλειδιού
    const { data, error } = await supabase
      .from('api_keys_storage')
      .insert({
        name: 'Helius API Key',
        key_value: 'ddb32813-1f4b-459d-8964-310b1b73a053',
        service: 'helius',
        description: 'Helius API key for RPC and data services',
        status: 'active',
        user_id: userId,
        is_encrypted: false
      })
      .select();
    
    if (error) {
      throw error;
    }
    
    toast.success('Το κλειδί Helius προστέθηκε επιτυχώς στην κλειδοθήκη');
    return data[0];
  } catch (error) {
    console.error('Error adding Helius key:', error);
    toast.error('Σφάλμα κατά την προσθήκη του κλειδιού Helius');
    return null;
  }
}
