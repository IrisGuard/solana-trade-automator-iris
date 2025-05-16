
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addHeliusEndpoints, addHeliusKey } from "./addHeliusEndpoints";
// Fix the import to use the named export
import { heliusKeyManager } from "@/services/solana/HeliusKeyManager";
import { heliusEndpointMonitor } from "@/services/helius/HeliusEndpointMonitor";

/**
 * Συγχρονισμός όλων των δεδομένων που σχετίζονται με το Helius API
 * (κλειδιά και endpoints) - χωρίς χρήση demo κλειδιών
 */
export async function syncAllHeliusData(userId: string): Promise<boolean> {
  try {
    toast.loading('Συγχρονισμός δεδομένων Helius...');
    
    // Συγχρονισμός των κλειδιών Helius - pass empty string as API key
    // User will need to add their actual API key later
    const keyResult = await addHeliusKey(userId, "");
    
    // Συγχρονισμός των endpoints - χωρίς hardcoded κλειδιά
    const endpointResult = await addHeliusEndpoints();
    
    // Ανανέωση των διαχειριστών - make sure they have forceReload method
    if (typeof heliusKeyManager.forceReload === 'function') {
      await heliusKeyManager.forceReload();
    } else {
      await heliusKeyManager.initialize();
    }
    
    if (heliusEndpointMonitor && typeof heliusEndpointMonitor.forceReload === 'function') {
      await heliusEndpointMonitor.forceReload();
    }
    
    if (keyResult && endpointResult) {
      toast.success('Τα δεδομένα Helius συγχρονίστηκαν επιτυχώς');
      toast.info('Προσθέστε το κλειδί API σας για να χρησιμοποιήσετε τις υπηρεσίες Helius', {
        duration: 5000,
        action: {
          label: "Οδηγός Helius",
          onClick: () => window.open("https://dev.helius.xyz/dashboard/app", "_blank")
        }
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
