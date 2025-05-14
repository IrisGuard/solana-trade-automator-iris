
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
 * Modified to remove direct references to 'api_keys' table which doesn't exist in the schema.
 */
export async function importHeliusKeysFromSqlSchema(userId: string): Promise<boolean> {
  // If no user ID, we can't import the keys
  if (!userId) {
    toast.error("Πρέπει να συνδεθείτε για να προσθέσετε τα κλειδιά Helius");
    return false;
  }

  try {
    // Since we don't have the api_keys table according to the schema,
    // we'll just use the api_keys_storage table directly
    console.log("Using api_keys_storage table for Helius keys import");
    return importHeliusKeys(userId);
  } catch (error) {
    console.error("Error importing Helius keys:", error);
    toast.error("Σφάλμα κατά την προσθήκη των κλειδιών Helius");
    return false;
  }
}
