
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { heliusKeyManager } from "@/services/solana/HeliusKeyManager";

/**
 * Συγχρονίζει τα κλειδιά Helius με τον πίνακα api_keys_storage του Supabase
 */
export async function syncHeliusKeysToSupabase(userId: string): Promise<boolean> {
  if (!userId) {
    toast.error("Πρέπει να συνδεθείτε για να συγχρονίσετε τα κλειδιά");
    return false;
  }

  try {
    // Λίστα με τα κλειδιά που θέλουμε να συγχρονίσουμε
    const heliusKeys = [
      {
        name: "Helius API Key Main",
        key_value: "ddb32813-1f4b-459d-8964-310b1b73a053",
        service: "helius",
        description: "Βασικό κλειδί API για το Helius RPC API",
        status: "active",
        user_id: userId,
        is_encrypted: false
      },
      {
        name: "Helius Mainnet RPC",
        key_value: "ddb32813-1f4b-459d-8964-310b1b73a053",
        service: "helius-rpc",
        description: "Κλειδί για το Mainnet RPC endpoint της Helius",
        status: "active",
        user_id: userId,
        is_encrypted: false
      },
      {
        name: "Helius WebSocket",
        key_value: "ddb32813-1f4b-459d-8964-310b1b73a053",
        service: "helius-websocket",
        description: "Κλειδί για το WebSocket endpoint της Helius",
        status: "active",
        user_id: userId,
        is_encrypted: false
      },
      {
        name: "Helius Eclipse",
        key_value: "ddb32813-1f4b-459d-8964-310b1b73a053",
        service: "helius-eclipse",
        description: "Κλειδί για το Eclipse endpoint της Helius",
        status: "active",
        user_id: userId,
        is_encrypted: false
      },
      {
        name: "Helius API Base",
        key_value: "ddb32813-1f4b-459d-8964-310b1b73a053",
        service: "helius-api",
        description: "Βασικό URL του API της Helius",
        status: "active",
        user_id: userId,
        is_encrypted: false
      },
      {
        name: "Helius Transactions",
        key_value: "ddb32813-1f4b-459d-8964-310b1b73a053",
        service: "helius-transactions",
        description: "Κλειδί για το Transactions endpoint της Helius",
        status: "active",
        user_id: userId,
        is_encrypted: false
      }
    ];

    // Έλεγχος για τα κλειδιά που υπάρχουν ήδη
    const { data: existingKeys, error: checkError } = await supabase
      .from('api_keys_storage')
      .select('service')
      .eq('user_id', userId);
      
    if (checkError) throw checkError;
    
    // Φιλτράρισμα των κλειδιών που δεν υπάρχουν ακόμα
    const existingServices = existingKeys?.map(key => key.service) || [];
    const keysToAdd = heliusKeys.filter(key => !existingServices.includes(key.service));
    
    if (keysToAdd.length === 0) {
      toast.info("Όλα τα κλειδιά Helius υπάρχουν ήδη!");
      return true;
    }
    
    // Εισαγωγή των νέων κλειδιών
    const { error } = await supabase.from('api_keys_storage').insert(keysToAdd);
    
    if (error) throw error;
    
    // Ενημέρωση του διαχειριστή κλειδιών
    await heliusKeyManager.initialize();
    
    toast.success(`Προστέθηκαν ${keysToAdd.length} κλειδιά Helius επιτυχώς!`);
    return true;
  } catch (error) {
    console.error("Σφάλμα συγχρονισμού κλειδιών Helius:", error);
    toast.error("Σφάλμα κατά τον συγχρονισμό των κλειδιών Helius");
    return false;
  }
}

/**
 * Συγχρονίζει τα endpoints του Helius με τον πίνακα api_endpoints του Supabase
 */
export async function syncHeliusEndpointsToSupabase(): Promise<boolean> {
  try {
    // Λίστα με τα endpoints που θέλουμε να συγχρονίσουμε
    const heliusEndpoints = [
      {
        name: "Helius Mainnet RPC",
        url: "https://mainnet.helius-rpc.com/?api-key=ddb32813-1f4b-459d-8964-310b1b73a053",
        category: "helius",
        is_active: true,
        is_public: true
      },
      {
        name: "Helius API v0",
        url: "https://api.helius.xyz/v0/?api-key=ddb32813-1f4b-459d-8964-310b1b73a053",
        category: "helius",
        is_active: true,
        is_public: true
      },
      {
        name: "Helius Transactions",
        url: "https://api.helius.xyz/v0/transactions/?api-key=ddb32813-1f4b-459d-8964-310b1b73a053",
        category: "helius",
        is_active: true,
        is_public: true
      },
      {
        name: "Helius WebSocket",
        url: "wss://mainnet.helius-rpc.com/?api-key=ddb32813-1f4b-459d-8964-310b1b73a053",
        category: "helius",
        is_active: true,
        is_public: true
      },
      {
        name: "Helius Eclipse",
        url: "https://eclipse.helius-rpc.com/",
        category: "helius",
        is_active: true,
        is_public: true
      }
    ];

    // Έλεγχος για τα endpoints που υπάρχουν ήδη
    const { data: existingEndpoints, error: checkError } = await supabase
      .from('api_endpoints')
      .select('url')
      .eq('category', 'helius');
      
    if (checkError) throw checkError;
    
    // Φιλτράρισμα των endpoints που δεν υπάρχουν ακόμα
    const existingUrls = existingEndpoints?.map(endpoint => endpoint.url) || [];
    const endpointsToAdd = heliusEndpoints.filter(endpoint => !existingUrls.includes(endpoint.url));
    
    if (endpointsToAdd.length === 0) {
      console.log("Όλα τα endpoints Helius υπάρχουν ήδη!");
      return true;
    }
    
    // Εισαγωγή των νέων endpoints
    const { error } = await supabase.from('api_endpoints').insert(endpointsToAdd);
    
    if (error) throw error;
    
    console.log(`Προστέθηκαν ${endpointsToAdd.length} endpoints Helius επιτυχώς!`);
    return true;
  } catch (error) {
    console.error("Σφάλμα συγχρονισμού endpoints Helius:", error);
    return false;
  }
}

/**
 * Συγχρονίζει όλα τα δεδομένα Helius με το Supabase
 */
export async function syncAllHeliusData(userId: string): Promise<boolean> {
  try {
    const keysResult = await syncHeliusKeysToSupabase(userId);
    const endpointsResult = await syncHeliusEndpointsToSupabase();
    
    return keysResult && endpointsResult;
  } catch (error) {
    console.error("Σφάλμα συγχρονισμού δεδομένων Helius:", error);
    toast.error("Σφάλμα κατά τον συγχρονισμό των δεδομένων Helius");
    return false;
  }
}
