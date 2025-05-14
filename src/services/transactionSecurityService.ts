
import { supabase } from '@/integrations/supabase/client';

export interface TransactionSettings {
  id?: string;
  user_id: string;
  max_daily_amount: number;
  max_transaction_amount: number;
  whitelist_only: boolean;
  delay_seconds?: number;
  notification_email?: boolean;
  notification_app?: boolean;
}

export interface ApprovedAddress {
  id?: string;
  user_id: string;
  address: string;
  description?: string;
  blockchain: string;
}

export const transactionSecurityService = {
  async getTransactionSettings(userId: string) {
    let { data, error } = await supabase
      .from('transaction_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') { // Δεν βρέθηκε εγγραφή
        // Δημιουργία προεπιλεγμένων ρυθμίσεων
        const defaultSettings: Omit<TransactionSettings, 'id'> = {
          user_id: userId,
          max_daily_amount: 1000,
          max_transaction_amount: 500,
          whitelist_only: false,
          delay_seconds: 0,
          notification_email: true,
          notification_app: true
        };
        
        const { data: newSettings, error: insertError } = await supabase
          .from('transaction_settings')
          .insert([defaultSettings])
          .select('*')
          .single();
          
        if (insertError) {
          console.error('Error creating default transaction settings:', insertError);
          throw insertError;
        }
        
        return newSettings;
      }
      
      console.error('Error fetching transaction settings:', error);
      throw error;
    }
    
    return data;
  },
  
  async updateTransactionSettings(userId: string, settings: Partial<TransactionSettings>) {
    const { data, error } = await supabase
      .from('transaction_settings')
      .update(settings)
      .eq('user_id', userId)
      .select('*')
      .single();
      
    if (error) {
      console.error('Error updating transaction settings:', error);
      throw error;
    }
    
    return data;
  },
  
  async getApprovedAddresses(userId: string) {
    const { data, error } = await supabase
      .from('approved_addresses')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching approved addresses:', error);
      throw error;
    }
    
    return data || [];
  },
  
  async addApprovedAddress(address: Omit<ApprovedAddress, 'id'>) {
    const { data, error } = await supabase
      .from('approved_addresses')
      .insert([address])
      .select('*')
      .single();
      
    if (error) {
      console.error('Error adding approved address:', error);
      throw error;
    }
    
    return data;
  },
  
  async removeApprovedAddress(id: string) {
    const { error } = await supabase
      .from('approved_addresses')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error removing approved address:', error);
      throw error;
    }
    
    return true;
  }
};
