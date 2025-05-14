
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { heliusKeyManager } from "@/services/solana/HeliusKeyManager";

/**
 * Utility to import Helius API keys into the api_keys_storage table
 * in Supabase, based on provided SQL schema.
 */
export async function importHeliusKeys(userId: string): Promise<boolean> {
  // If no user ID, we can't import the keys
  if (!userId) {
    toast.error("Πρέπει να συνδεθείτε για να προσθέσετε τα κλειδιά Helius");
    return false;
  }

  try {
    // Define the keys we want to import
    const apiKeyEntries = [
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

    // Check which keys already exist in the database
    const { data: existingKeys, error: checkError } = await supabase
      .from('api_keys_storage')
      .select('service')
      .eq('user_id', userId);

    if (checkError) {
      console.error("Error checking existing keys:", checkError);
      throw checkError;
    }

    // Filter out keys that already exist
    const existingServices = existingKeys?.map(k => k.service) || [];
    const keysToAdd = apiKeyEntries.filter(entry => !existingServices.includes(entry.service));

    if (keysToAdd.length === 0) {
      toast.info("Όλα τα κλειδιά Helius υπάρχουν ήδη");
      return true;
    }

    // Insert the new keys
    const { data, error } = await supabase
      .from('api_keys_storage')
      .insert(keysToAdd)
      .select();

    if (error) {
      console.error("Error adding Helius keys:", error);
      throw error;
    }

    // Refresh the HeliusKeyManager
    await heliusKeyManager.initialize();

    toast.success(`Προστέθηκαν ${keysToAdd.length} κλειδιά Helius επιτυχώς!`);
    return true;
  } catch (error) {
    console.error("Error importing Helius keys:", error);
    toast.error("Σφάλμα κατά την προσθήκη των κλειδιών Helius");
    return false;
  }
}

/**
 * Import Helius API keys into Supabase specifically based on the SQL schema provided in the user's message.
 */
export async function importHeliusKeysFromSqlSchema(userId: string): Promise<boolean> {
  // If no user ID, we can't import the keys
  if (!userId) {
    toast.error("Πρέπει να συνδεθείτε για να προσθέσετε τα κλειδιά Helius");
    return false;
  }

  try {
    // Check if table exists first
    const { error: tableCheckError } = await supabase
      .from('api_keys')
      .select('id', { count: 'exact', head: true });

    // If the api_keys table doesn't exist, fall back to api_keys_storage
    if (tableCheckError) {
      console.log("api_keys table not found, using api_keys_storage instead");
      return importHeliusKeys(userId);
    }

    // Define the keys based on the SQL schema provided by the user
    const apiKeys = [
      {
        name: 'HELIUS_API_KEY_MAIN',
        value: 'ddb32813-1f4b-459d-8964-310b1b73a053',
        category: 'blockchain',
        status: 'active',
        provider_type: 'helius',
        description: 'Βασικό κλειδί API για το Helius RPC API',
        is_required: true
      },
      {
        name: 'HELIUS_MAINNET_RPC',
        value: 'ddb32813-1f4b-459d-8964-310b1b73a053',
        category: 'blockchain',
        status: 'active',
        provider_type: 'helius',
        description: 'Κλειδί για το Mainnet RPC endpoint της Helius',
        is_required: true
      },
      {
        name: 'HELIUS_WEBSOCKET',
        value: 'ddb32813-1f4b-459d-8964-310b1b73a053',
        category: 'blockchain',
        status: 'active',
        provider_type: 'helius',
        description: 'Κλειδί για το WebSocket endpoint της Helius',
        is_required: true
      },
      {
        name: 'HELIUS_ECLIPSE',
        value: 'ddb32813-1f4b-459d-8964-310b1b73a053',
        category: 'blockchain',
        status: 'active',
        provider_type: 'helius',
        description: 'Κλειδί για το Eclipse endpoint της Helius',
        is_required: false
      },
      {
        name: 'HELIUS_API_BASE',
        value: 'ddb32813-1f4b-459d-8964-310b1b73a053',
        category: 'blockchain',
        status: 'active',
        provider_type: 'helius',
        description: 'Βασικό URL του API της Helius',
        is_required: true
      },
      {
        name: 'HELIUS_TRANSACTIONS',
        value: 'ddb32813-1f4b-459d-8964-310b1b73a053',
        category: 'blockchain',
        status: 'active',
        provider_type: 'helius',
        description: 'Κλειδί για το Transactions endpoint της Helius',
        is_required: true
      }
    ];

    // Check which keys already exist in the database
    const { data: existingKeys, error: checkError } = await supabase
      .from('api_keys')
      .select('name');

    if (checkError) {
      console.error("Error checking existing keys:", checkError);
      throw checkError;
    }

    // Filter out keys that already exist
    const existingNames = existingKeys?.map(k => k.name) || [];
    const keysToAdd = apiKeys.filter(entry => !existingNames.includes(entry.name));

    if (keysToAdd.length === 0) {
      toast.info("Όλα τα κλειδιά Helius υπάρχουν ήδη");
      return true;
    }

    // Insert the new keys
    const { data, error } = await supabase
      .from('api_keys')
      .insert(keysToAdd)
      .select();

    if (error) {
      console.error("Error adding Helius keys:", error);
      throw error;
    }

    // Also add keys to the api_keys_storage for the HeliusKeyManager
    await importHeliusKeys(userId);

    toast.success(`Προστέθηκαν ${keysToAdd.length} κλειδιά Helius επιτυχώς!`);
    return true;
  } catch (error) {
    console.error("Error importing Helius keys:", error);
    toast.error("Σφάλμα κατά την προσθήκη των κλειδιών Helius");
    return false;
  }
}
