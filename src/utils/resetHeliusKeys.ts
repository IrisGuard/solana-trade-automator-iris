
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { heliusKeyManager } from "@/services/helius/HeliusKeyManager";
import { heliusService } from "@/services/helius/HeliusService";

/**
 * Resets all Helius API keys and adds the new master key
 */
export async function resetHeliusKeys(userId: string, apiKey: string = "ddb32813-1f4b-459d-8964-310b1b73a053"): Promise<boolean> {
  if (!userId) {
    toast.error("Απαιτείται σύνδεση για τον επαναπροσδιορισμό των κλειδιών");
    return false;
  }

  try {
    // 1. Delete all existing Helius keys
    const { error: deleteError } = await supabase
      .from('api_keys_storage')
      .delete()
      .eq('user_id', userId)
      .like('service', 'helius%');
      
    if (deleteError) {
      console.error("Σφάλμα κατά τη διαγραφή των παλιών κλειδιών:", deleteError);
      toast.error("Σφάλμα κατά τη διαγραφή των παλιών κλειδιών");
      return false;
    }
    
    // 2. Add the new master Helius key
    const newKey = {
      name: "Helius Master API Key",
      key_value: apiKey,
      service: "helius",
      description: "Master key for all Helius API services",
      status: "active",
      user_id: userId,
      is_encrypted: false
    };
    
    const { error: insertError } = await supabase
      .from('api_keys_storage')
      .insert(newKey);
      
    if (insertError) {
      console.error("Σφάλμα κατά την προσθήκη του νέου κλειδιού:", insertError);
      toast.error("Σφάλμα κατά την προσθήκη του νέου κλειδιού");
      return false;
    }
    
    // 3. Επανεκκίνηση του HeliusKeyManager
    try {
      await heliusKeyManager.forceReload();
      console.log("HeliusKeyManager επανεκκινήθηκε επιτυχώς");
    } catch (err) {
      console.error("Σφάλμα κατά την επανεκκίνηση του HeliusKeyManager:", err);
    }
    
    // 4. Επανεκκίνηση του HeliusService
    try {
      await heliusService.reinitialize();
      console.log("HeliusService επανεκκινήθηκε επιτυχώς");
    } catch (err) {
      console.error("Σφάλμα κατά την επανεκκίνηση του HeliusService:", err);
    }
    
    // 5. Έλεγχος αν το κλειδί λειτουργεί
    try {
      const isWorking = await heliusService.checkApiKey(apiKey);
      if (isWorking) {
        toast.success("Το νέο κλειδί Helius λειτουργεί σωστά!");
      } else {
        toast.warning("Το νέο κλειδί Helius προστέθηκε αλλά δεν μπορεί να επικυρωθεί");
      }
    } catch (err) {
      console.error("Σφάλμα κατά τον έλεγχο του κλειδιού:", err);
    }
    
    return true;
  } catch (error) {
    console.error("Σφάλμα κατά τον επαναπροσδιορισμό των κλειδιών:", error);
    toast.error("Σφάλμα κατά τον επαναπροσδιορισμό των κλειδιών");
    return false;
  }
}
