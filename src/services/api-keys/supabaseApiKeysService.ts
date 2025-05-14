
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ApiKeyEntry } from "./types";

// Fetch API keys from Supabase
export async function fetchApiKeys(userId?: string) {
  try {
    let query = supabase.from('api_keys_storage').select('*');
    
    // Apply user filter if a user ID is provided
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as ApiKeyEntry[];
  } catch (error) {
    console.error('Error fetching API keys:', error);
    toast.error('Error fetching API keys');
    return [];
  }
}

// Add a new API key to Supabase
export async function addApiKey(keyData: Omit<ApiKeyEntry, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('api_keys_storage')
      .insert([keyData])
      .select();
    
    if (error) throw error;
    
    toast.success('API key added successfully');
    return data[0] as ApiKeyEntry;
  } catch (error) {
    console.error('Error adding API key:', error);
    toast.error('Failed to add API key');
    return null;
  }
}

// Update an existing API key
export async function updateApiKey(id: string, updates: Partial<ApiKeyEntry>) {
  try {
    const { data, error } = await supabase
      .from('api_keys_storage')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    toast.success('API key updated successfully');
    return data[0] as ApiKeyEntry;
  } catch (error) {
    console.error('Error updating API key:', error);
    toast.error('Failed to update API key');
    return null;
  }
}

// Delete an API key
export async function deleteApiKey(id: string) {
  try {
    const { error } = await supabase
      .from('api_keys_storage')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('API key deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting API key:', error);
    toast.error('Failed to delete API key');
    return false;
  }
}

// Test an API key's functionality
export async function testApiKey(service: string, keyValue: string): Promise<boolean> {
  try {
    // This is a simple placeholder implementation
    // In a real application, you'd make an actual API call to test the key
    const validServices = ['helius', 'coingecko', 'jupiter', 'alchemy'];
    
    if (!validServices.includes(service.toLowerCase())) {
      return false;
    }
    
    // Simulate API validation with a basic check
    if (!keyValue || keyValue.length < 8) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error testing API key:', error);
    return false;
  }
}
