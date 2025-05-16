
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    
    // Λίστα με τα template endpoints του Helius που θέλουμε να προσθέσουμε
    // Σημείωση: Τα API_KEY θα πρέπει να συμπληρωθούν από τον χρήστη
    const heliusEndpoints = [
      {
        name: "Helius Enhanced Transactions",
        url: `https://api.helius.xyz/v0/transactions?api-key={API_KEY}`,
        category: "helius",
        is_active: true,
        is_public: true
      },
      {
        name: "Helius Name Service",
        url: `https://api.helius.xyz/v0/addresses/{address}/names?api-key={API_KEY}`,
        category: "helius",
        is_active: true,
        is_public: true
      },
      {
        name: "Helius Token Balances",
        url: `https://api.helius.xyz/v0/addresses/{address}/balances?api-key={API_KEY}`,
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
export const addHeliusKey = async (userId: string, apiKey: string): Promise<boolean> => {
  if (!apiKey || !apiKey.trim()) {
    toast.error("Παρακαλώ εισάγετε ένα έγκυρο κλειδί API");
    return false;
  }

  try {
    // Έλεγχος αν υπάρχει ήδη το κλειδί
    const { data: existingKeys, error: checkError } = await supabase
      .from('api_keys_storage')
      .select('*')
      .eq('service', 'helius')
      .eq('key_value', apiKey)
      .eq('user_id', userId);
    
    if (checkError) throw checkError;
    
    // Αν υπάρχουν ήδη κλειδιά με την ίδια τιμή, επιστρέφουμε αποτυχία
    if (existingKeys && existingKeys.length > 0) {
      console.log('Κλειδί Helius με την ίδια τιμή υπάρχει ήδη');
      toast.error("Αυτό το κλειδί API υπάρχει ήδη");
      return false;
    }
    
    // Δημιουργία νέου κλειδιού Helius
    const heliusKey = {
      name: "Helius API Key",
      key_value: apiKey,
      service: "helius",
      description: "Key for accessing Helius API services",
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
    toast.success("Το κλειδί API προστέθηκε επιτυχώς");
    
    return true;
  } catch (error) {
    console.error('Σφάλμα κατά την προσθήκη του κλειδιού Helius:', error);
    toast.error('Σφάλμα κατά την προσθήκη κλειδιού Helius');
    return false;
  }
};

// Έλεγχος αν ένα κλειδί Helius είναι έγκυρο
export const validateHeliusKey = async (apiKey: string): Promise<boolean> => {
  try {
    if (!apiKey || !apiKey.trim()) return false;

    const url = `https://api.helius.xyz/v0/addresses/vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg/balances?api-key=${apiKey}`;
    const response = await fetch(url);
    
    return response.status === 200;
  } catch (error) {
    console.error("Error validating Helius key:", error);
    return false;
  }
};
