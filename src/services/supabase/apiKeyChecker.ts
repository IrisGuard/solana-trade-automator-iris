
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { errorCollector } from "@/utils/error-handling/collector";
import { testSingleKey } from "@/components/security/apiVault/utils/testUtils";

/**
 * Τύπος για το αποτέλεσμα του ελέγχου κλειδιού
 */
interface KeyCheckResult {
  id: string;
  name: string;
  service: string;
  status: string;
  isWorking: boolean;
  lastChecked: string;
}

/**
 * Συλλογή με τα αποτελέσματα ελέγχων ανά υπηρεσία
 */
interface ServiceCheckResults {
  [service: string]: {
    total: number;
    working: number;
    notWorking: number;
    keys: KeyCheckResult[];
  }
}

/**
 * Υπηρεσία ελέγχου κλειδιών API
 */
export class ApiKeyChecker {
  /**
   * Έλεγχος όλων των κλειδιών API στο Supabase
   */
  static async checkAllKeys(userId: string): Promise<ServiceCheckResults> {
    try {
      // Λήψη όλων των κλειδιών από το Supabase
      const { data: keys, error } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('user_id', userId)
        .order('service');

      if (error) throw error;
      if (!keys || keys.length === 0) {
        toast.info("Δεν βρέθηκαν κλειδιά API για έλεγχο");
        return {};
      }

      // Οργάνωση των αποτελεσμάτων ανά υπηρεσία
      const results: ServiceCheckResults = {};
      
      // Έλεγχος κάθε κλειδιού
      for (const key of keys) {
        // Εκτέλεση του ελέγχου
        const isWorking = await this.testKeyFunctionality({
          id: key.id,
          name: key.name,
          key: key.key_value,
          service: key.service,
          status: key.status || 'active',
          description: key.description || '',
        });
        
        // Καταχώριση του αποτελέσματος
        if (!results[key.service]) {
          results[key.service] = {
            total: 0,
            working: 0,
            notWorking: 0,
            keys: []
          };
        }
        
        results[key.service].total++;
        if (isWorking) {
          results[key.service].working++;
        } else {
          results[key.service].notWorking++;
        }
        
        // Προσθήκη του κλειδιού στην αντίστοιχη υπηρεσία
        results[key.service].keys.push({
          id: key.id,
          name: key.name,
          service: key.service,
          status: key.status || 'active',
          isWorking,
          lastChecked: new Date().toISOString()
        });
      }

      // Προαιρετική ενημέρωση του Supabase με τα αποτελέσματα ελέγχου
      await this.updateKeysStatus(results);
      
      return results;
    } catch (error) {
      errorCollector.captureError(error instanceof Error ? error : new Error('Error checking API keys'), {
        component: 'ApiKeyChecker',
        source: 'client'
      });
      console.error('Σφάλμα κατά τον έλεγχο των κλειδιών API:', error);
      toast.error('Σφάλμα κατά τον έλεγχο των κλειδιών API');
      return {};
    }
  }

  /**
   * Έλεγχος λειτουργικότητας ενός κλειδιού API
   */
  private static async testKeyFunctionality(apiKey: any): Promise<boolean> {
    try {
      // Χρήση της συνάρτησης testSingleKey από τα utils
      return await testSingleKey(apiKey);
    } catch (error) {
      console.error(`Σφάλμα κατά τον έλεγχο του κλειδιού ${apiKey.name}:`, error);
      return false;
    }
  }

  /**
   * Ενημέρωση της κατάστασης των κλειδιών στο Supabase
   */
  private static async updateKeysStatus(results: ServiceCheckResults): Promise<void> {
    const updates = [];
    
    // Συλλογή όλων των κλειδιών που πρέπει να ενημερωθούν
    for (const service in results) {
      for (const key of results[service].keys) {
        // Ενημέρωση μόνο των μη λειτουργικών κλειδιών ή όσων έχουν αλλάξει κατάσταση
        if (!key.isWorking && key.status === 'active') {
          updates.push({
            id: key.id,
            status: 'inactive',
            updated_at: new Date().toISOString()
          });
        }
      }
    }
    
    // Αν υπάρχουν ενημερώσεις για να γίνουν, εκτέλεσέ τες
    if (updates.length > 0) {
      try {
        const { error } = await supabase
          .from('api_keys_storage')
          .upsert(updates, { onConflict: 'id' });
          
        if (error) throw error;
      } catch (error) {
        console.error('Σφάλμα κατά την ενημέρωση των κλειδιών:', error);
      }
    }
  }
}
