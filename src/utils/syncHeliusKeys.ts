
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addHeliusEndpoints, addHeliusKey } from "./addHeliusEndpoints";
// Διόρθωση του μονοπατιού εισαγωγής για να χρησιμοποιήσει τον σωστό HeliusKeyManager
import { heliusKeyManager } from "@/services/helius/HeliusKeyManager";
import { heliusEndpointMonitor } from "@/services/helius/HeliusEndpointMonitor";
import { heliusService } from "@/services/helius/HeliusService";

/**
 * Συγχρονισμός όλων των δεδομένων που σχετίζονται με το Helius API
 * (κλειδιά και endpoints)
 */
export async function syncAllHeliusData(userId: string): Promise<boolean> {
  try {
    toast.loading('Συγχρονισμός δεδομένων Helius...');
    
    // Συγχρονισμός των κλειδιών Helius
    console.log("Συγχρονισμός κλειδιού Helius:", userId);
    const apiKey = "ddb32813-1f4b-459d-8964-310b1b73a053";
    const keyResult = await addHeliusKey(userId, apiKey);
    
    // Συγχρονισμός των endpoints
    console.log("Συγχρονισμός endpoints Helius");
    const endpointResult = await addHeliusEndpoints();
    
    // Ανανέωση των διαχειριστών - χρησιμοποιώντας τις μεθόδους που προσθέσαμε
    try {
      console.log("Επανεκκίνηση HeliusKeyManager");
      if (heliusKeyManager && typeof heliusKeyManager.forceReload === 'function') {
        await heliusKeyManager.forceReload();
      } else if (heliusKeyManager && typeof heliusKeyManager.initialize === 'function') {
        await heliusKeyManager.initialize();
      } else {
        console.error("Δεν βρέθηκε μέθοδος forceReload ή initialize στο heliusKeyManager");
      }
    } catch (error) {
      console.error("Σφάλμα κατά την επανεκκίνηση του HeliusKeyManager:", error);
    }
    
    if (heliusEndpointMonitor && typeof heliusEndpointMonitor.forceReload === 'function') {
      await heliusEndpointMonitor.forceReload();
    }
    
    // Επανεκκίνηση του HeliusService μετά την ενημέρωση του κλειδιού
    try {
      console.log("Επανεκκίνηση HeliusService");
      if (heliusService && typeof heliusService.reinitialize === 'function') {
        await heliusService.reinitialize();
      } else {
        console.error("Δεν βρέθηκε μέθοδος reinitialize στο heliusService");
      }
    } catch (error) {
      console.error("Σφάλμα κατά την επανεκκίνηση του HeliusService:", error);
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
