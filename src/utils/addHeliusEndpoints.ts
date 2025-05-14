
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { heliusKeyManager } from "@/services/solana/HeliusKeyManager";

// Σταθερό δοκιμαστικό κλειδί Helius για επίδειξη
const DEMO_HELIUS_KEY = "ddb32813-1f4b-459d-8964-310b1b73a053";

// Προσθέτει τα προκαθορισμένα endpoints του Helius στη βάση δεδομένων
export const addHeliusEndpoints = async (): Promise<boolean> => {
  try {
    // Έλεγχος αν υπάρχουν ήδη τα endpoints
    const { data: existingEndpoints, error: checkError } = await supabase
      .from('api_endpoints')
      .select('*')
      .eq('category', 'helius');
    
    if (checkError) throw checkError;
    
    // Αν υπάρχουν ήδη endpoints Helius, επιστρέφουμε επιτυχία
    if (existingEndpoints && existingEndpoints.length > 0) {
      console.log('Endpoints Helius ήδη υπάρχουν:', existingEndpoints.length);
      return true;
    }
    
    // Λίστα με τα endpoints του Helius που θέλουμε να προσθέσουμε
    const heliusEndpoints = [
      {
        name: "Helius Enhanced Transactions",
        url: `https://api.helius.xyz/v0/transactions?api-key=${DEMO_HELIUS_KEY}`,
        category: "helius",
        is_active: true,
        is_public: true
      },
      {
        name: "Helius Name Service",
        url: `https://api.helius.xyz/v0/addresses/{address}/names?api-key=${DEMO_HELIUS_KEY}`,
        category: "helius",
        is_active: true,
        is_public: true
      },
      {
        name: "Helius Token Balances",
        url: `https://api.helius.xyz/v0/addresses/{address}/balances?api-key=${DEMO_HELIUS_KEY}`,
        category: "helius",
        is_active: true,
        is_public: true
      }
    ];
    
    // Προσθήκη των endpoints στη βάση δεδομένων
    const { error } = await supabase
      .from('api_endpoints')
      .insert(heliusEndpoints);
      
    if (error) throw error;
    
    console.log('Επιτυχής προσθήκη endpoints Helius');
    return true;
  } catch (error) {
    console.error('Σφάλμα κατά την προσθήκη των endpoints Helius:', error);
    toast.error('Σφάλμα κατά την προσθήκη endpoints Helius');
    return false;
  }
};

// Προσθέτει το κλειδί API Helius στην κλειδοθήκη του χρήστη
export const addHeliusKey = async (userId: string): Promise<boolean> => {
  try {
    // Έλεγχος αν υπάρχει ήδη το κλειδί
    const { data: existingKeys, error: checkError } = await supabase
      .from('api_keys_storage')
      .select('*')
      .eq('service', 'helius')
      .eq('user_id', userId);
    
    if (checkError) throw checkError;
    
    // Αν υπάρχουν ήδη κλειδιά Helius, επιστρέφουμε επιτυχία
    if (existingKeys && existingKeys.length > 0) {
      console.log('Κλειδιά Helius ήδη υπάρχουν:', existingKeys.length);
      return true;
    }
    
    // Δημιουργία νέου κλειδιού Helius
    const heliusKey = {
      name: "Helius API Demo Key",
      key_value: DEMO_HELIUS_KEY,
      service: "helius",
      description: "Demo key for accessing Helius API services",
      status: "active",
      user_id: userId,
      is_encrypted: false
    };
    
    // Προσθήκη του κλειδιού στη βάση δεδομένων
    const { error } = await supabase
      .from('api_keys_storage')
      .insert(heliusKey);
      
    if (error) throw error;
    
    console.log('Επιτυχής προσθήκη κλειδιού Helius');
    
    // Ενημέρωση του key manager
    await heliusKeyManager.initialize();
    
    return true;
  } catch (error) {
    console.error('Σφάλμα κατά την προσθήκη του κλειδιού Helius:', error);
    toast.error('Σφάλμα κατά την προσθήκη κλειδιού Helius');
    return false;
  }
};
