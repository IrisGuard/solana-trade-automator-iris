
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addHeliusEndpoints, addHeliusKey } from "./addHeliusEndpoints";
// Fix the import path to use the correct HeliusKeyManager instance
import { heliusKeyManager } from "@/services/helius/HeliusKeyManager";
import { heliusEndpointMonitor } from "@/services/helius/HeliusEndpointMonitor";
import { heliusService } from "@/services/helius/HeliusService";

/**
 * Συγχρονισμός όλων των δεδομένων που σχετίζονται με το Helius API
 * (κλειδιά και endpoints) - χωρίς χρήση demo κλειδιών
 */
export async function syncAllHeliusData(userId: string): Promise<boolean> {
  try {
    toast.loading('Συγχρονισμός δεδομένων Helius...');
    
    // Συγχρονισμός των κλειδιών Helius
    // Use the provided API key instead of empty string
    const apiKey = "ddb32813-1f4b-459d-8964-310b1b73a053";
    const keyResult = await addHeliusKey(userId, apiKey);
    
    // Συγχρονισμός των endpoints - χωρίς hardcoded κλειδιά
    const endpointResult = await addHeliusEndpoints();
    
    // Ανανέωση των διαχειριστών - use the methods we added
    try {
      console.log("Forcing reload of HeliusKeyManager");
      // Try the forceReload method first
      if (heliusKeyManager) {
        await heliusKeyManager.forceReload();
      }
    } catch (error) {
      // Fall back to initialize if forceReload fails
      console.log("Falling back to initialize method", error);
      if (heliusKeyManager) {
        await heliusKeyManager.initialize();
      }
    }
    
    if (heliusEndpointMonitor && typeof heliusEndpointMonitor.forceReload === 'function') {
      await heliusEndpointMonitor.forceReload();
    }
    
    // Reinitialize HeliusService after key update
    try {
      console.log("Reinitializing HeliusService");
      await heliusService.reinitialize();
    } catch (error) {
      console.error("Error reinitializing HeliusService:", error);
    }
    
    if (keyResult && endpointResult) {
      toast.success('Τα δεδομένα Helius συγχρονίστηκαν επιτυχώς');
      toast.info(`Το κλειδί API Helius προστέθηκε: ${apiKey.substring(0, 8)}...`, {
        duration: 5000
      });
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
