
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ApiEndpoint {
  id?: string;
  name: string;
  url: string;
  category?: string;
  is_active?: boolean;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function fetchApiEndpoints() {
  try {
    const { data, error } = await supabase
      .from('api_endpoints')
      .select('*')
      .order('category', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data as ApiEndpoint[];
  } catch (error) {
    console.error('Error fetching API endpoints:', error);
    toast.error('Σφάλμα κατά τη φόρτωση των API endpoints');
    return [];
  }
}

export async function addApiEndpoint(endpoint: ApiEndpoint) {
  try {
    const { data, error } = await supabase
      .from('api_endpoints')
      .insert([endpoint])
      .select();
    
    if (error) {
      throw error;
    }
    
    toast.success('Το API endpoint προστέθηκε επιτυχώς');
    return data[0] as ApiEndpoint;
  } catch (error) {
    console.error('Error adding API endpoint:', error);
    toast.error('Σφάλμα κατά την προσθήκη του API endpoint');
    return null;
  }
}

export async function updateApiEndpoint(id: string, endpoint: Partial<ApiEndpoint>) {
  try {
    const { data, error } = await supabase
      .from('api_endpoints')
      .update(endpoint)
      .eq('id', id)
      .select();
    
    if (error) {
      throw error;
    }
    
    toast.success('Το API endpoint ενημερώθηκε επιτυχώς');
    return data[0] as ApiEndpoint;
  } catch (error) {
    console.error('Error updating API endpoint:', error);
    toast.error('Σφάλμα κατά την ενημέρωση του API endpoint');
    return null;
  }
}

export async function deleteApiEndpoint(id: string) {
  try {
    const { error } = await supabase
      .from('api_endpoints')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast.success('Το API endpoint διαγράφηκε επιτυχώς');
    return true;
  } catch (error) {
    console.error('Error deleting API endpoint:', error);
    toast.error('Σφάλμα κατά τη διαγραφή του API endpoint');
    return false;
  }
}

export async function importEndpointsFromEnv() {
  try {
    const endpoints: ApiEndpoint[] = [];
    
    // Extract API endpoints from window.env
    Object.entries(import.meta.env).forEach(([key, value]) => {
      if (key.startsWith('EXPO_PUBLIC_') && key.includes('URL')) {
        const name = key.replace('EXPO_PUBLIC_', '').replace('_URL', '');
        
        endpoints.push({
          name: name,
          url: value as string,
          category: getCategoryFromName(name)
        });
      }
    });
    
    if (endpoints.length === 0) {
      toast.info('Δεν βρέθηκαν API endpoints στο .env αρχείο');
      return [];
    }
    
    // Check if endpoints already exist
    const { data: existingEndpoints } = await supabase
      .from('api_endpoints')
      .select('name');
    
    const existingNames = existingEndpoints?.map(ep => ep.name) || [];
    const newEndpoints = endpoints.filter(ep => !existingNames.includes(ep.name));
    
    if (newEndpoints.length === 0) {
      toast.info('Όλα τα API endpoints υπάρχουν ήδη στη βάση δεδομένων');
      return [];
    }
    
    // Add new endpoints
    const { data, error } = await supabase
      .from('api_endpoints')
      .insert(newEndpoints)
      .select();
    
    if (error) {
      throw error;
    }
    
    toast.success(`Προστέθηκαν ${newEndpoints.length} νέα API endpoints`);
    return data as ApiEndpoint[];
  } catch (error) {
    console.error('Error importing API endpoints:', error);
    toast.error('Σφάλμα κατά την εισαγωγή των API endpoints');
    return [];
  }
}

// Helper function to categorize endpoints
function getCategoryFromName(name: string): string {
  name = name.toLowerCase();
  
  if (name.includes('solana') || name.includes('sol')) {
    return 'solana';
  } else if (name.includes('jupiter') || name.includes('raydium') || name.includes('orca')) {
    return 'dex';
  } else if (name.includes('coingecko') || name.includes('coincap') || name.includes('coinlib') || name.includes('coinpaprika') || name.includes('cryptocompare')) {
    return 'price';
  } else {
    return 'other';
  }
}
