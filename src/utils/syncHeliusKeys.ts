
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addHeliusEndpoints, addHeliusKey } from "./addHeliusEndpoints";
import { heliusKeyManager } from "@/services/solana/HeliusKeyManager";
import { heliusEndpointMonitor } from "@/services/helius/HeliusEndpointMonitor";

/**
 * Συγχρονισμός όλων των δεδομένων που σχετίζονται με το Helius API
 * (κλειδιά και endpoints)
 */
export async function syncAllHeliusData(userId: string): Promise<boolean> {
  try {
    toast.loading('Συγχρονισμός δεδομένων Helius...');
    
    // Συγχρονισμός των κλειδιών Helius
    const keyResult = await addHeliusKey(userId);
    
    // Συγχρονισμός των endpoints
    const endpointResult = await addHeliusEndpoints();
    
    // Ανανέωση των διαχειριστών
    await heliusKeyManager.forceReload();
    await heliusEndpointMonitor.forceReload();
    
    if (keyResult && endpointResult) {
      toast.success('Τα δεδομένα Helius συγχρονίστηκαν επιτυχώς');
      return true;
    } else {
      toast.error('Υπήρξαν κάποια σφάλματα κατά τον συγχρονισμό των δεδομένων Helius');
      return false;
    }
  } catch (error) {
    console.error('Σφάλμα κατά τον συγχρονισμό των δεδομένων Helius:', error);
    toast.error('Σφάλμα κατά τον συγχρονισμό των δεδομένων Helius');
    return false;
  } finally {
    toast.dismiss();
  }
}
