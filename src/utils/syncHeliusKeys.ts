
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addHeliusEndpoints } from "./addHeliusEndpoints";
// Διόρθωση του μονοπατιού εισαγωγής για να χρησιμοποιήσει τον σωστό HeliusKeyManager
import { heliusKeyManager } from "@/services/helius/HeliusKeyManager";
import { heliusEndpointMonitor } from "@/services/helius/HeliusEndpointMonitor";
import { heliusService } from "@/services/helius/HeliusService";
import { v4 as uuidv4 } from 'uuid';

/**
 * Συγχρονισμός όλων των δεδομένων που σχετίζονται με το Helius API
 * (κλειδιά και endpoints)
 */
export async function syncAllHeliusData(userId: string): Promise<boolean> {
  try {
    toast.loading('Συγχρονισμός δεδομένων Helius...');
    
    // Έλεγχος αν το userId είναι έγκυρο UUID
    let validUserId = userId;
    try {
      // Validate if userId is a valid UUID, if not generate a temporary one
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
        console.warn("User ID is not a valid UUID format, using a generated UUID instead");
        validUserId = uuidv4();
      }
    } catch (e) {
      console.error("Error validating user ID:", e);
      validUserId = uuidv4();
    }
    
    console.log("Συγχρονισμός κλειδιού Helius:", validUserId);
    const apiKey = "ddb32813-1f4b-459d-8964-310b1b73a053";
    
    let keyResult = false;
    try {
      // Add Helius key
      const { data: existingKeys } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('service', 'helius');
      
      if (!existingKeys || existingKeys.length === 0) {
        // Only add a key if none exists
        const { data, error } = await supabase.from('api_keys_storage').insert({
          user_id: validUserId,
          name: 'Helius API Key',
          service: 'helius',
          key_value: apiKey,
          status: 'active',
          description: 'Default Helius API key',
          is_encrypted: false
        });
        
        if (error) {
          console.error("Error adding Helius key:", error);
        } else {
          keyResult = true;
        }
      } else {
        console.log("Helius key already exists, skipping addition");
        keyResult = true;
      }
    } catch (error) {
      console.error('Σφάλμα κατά την προσθήκη του κλειδιού Helius:', error);
    }
    
    // Συγχρονισμός των endpoints
    console.log("Συγχρονισμός endpoints Helius");
    const endpointResult = await addHeliusEndpoints();
    
    // Ανανέωση των διαχειριστών
    try {
      console.log("Επανεκκίνηση HeliusKeyManager");
      if (heliusKeyManager) {
        await heliusKeyManager.forceReload();
      } else {
        console.error("Δεν βρέθηκε το heliusKeyManager");
      }
    } catch (error) {
      console.error("Σφάλμα κατά την επανεκκίνηση του HeliusKeyManager:", error);
    }
    
    if (heliusEndpointMonitor && typeof heliusEndpointMonitor.forceReload === 'function') {
      try {
        await heliusEndpointMonitor.forceReload();
      } catch (error) {
        console.error("Error reloading endpoint monitor:", error);
      }
    }
    
    // Επανεκκίνηση του HeliusService μετά την ενημέρωση του κλειδιού
    try {
      console.log("Επανεκκίνηση HeliusService");
      if (heliusService) {
        await heliusService.reinitialize();
      } else {
        console.error("Δεν βρέθηκε το heliusService");
      }
    } catch (error) {
      console.error("Σφάλμα κατά την επανεκκίνηση του HeliusService:", error);
    }
    
    if (keyResult || endpointResult) {
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
