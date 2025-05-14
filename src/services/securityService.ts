
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SecuritySettings {
  id?: string;
  user_id?: string;
  setting_name: string;
  is_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TransactionSettings {
  id?: string;
  user_id?: string;
  max_daily_amount: number;
  max_transaction_amount: number;
  whitelist_only: boolean;
  delay_seconds: number;
  notification_email: boolean;
  notification_app: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApprovedAddress {
  id?: string;
  user_id?: string;
  address: string;
  description?: string;
  blockchain: string;
  created_at?: string;
}

export interface UserSession {
  id?: string;
  user_id?: string;
  device?: string;
  ip_address?: string;
  location?: string;
  login_at?: string;
  logout_at?: string;
  is_active?: boolean;
}

export const securityService = {
  // Λειτουργίες για ρυθμίσεις ασφαλείας
  async getSecuritySettings(userId: string): Promise<SecuritySettings[]> {
    try {
      const { data, error } = await supabase
        .from('security_settings')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching security settings:', error);
      toast.error('Σφάλμα κατά την ανάκτηση των ρυθμίσεων ασφαλείας');
      return [];
    }
  },
  
  async updateSecuritySetting(settingId: string, isEnabled: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('security_settings')
        .update({ 
          is_enabled: isEnabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', settingId);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating security setting:', error);
      toast.error('Σφάλμα κατά την ενημέρωση της ρύθμισης ασφαλείας');
      return false;
    }
  },
  
  async createSecuritySetting(setting: SecuritySettings): Promise<SecuritySettings | null> {
    try {
      const { data, error } = await supabase
        .from('security_settings')
        .insert({
          user_id: setting.user_id,
          setting_name: setting.setting_name,
          is_enabled: setting.is_enabled
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating security setting:', error);
      toast.error('Σφάλμα κατά τη δημιουργία της ρύθμισης ασφαλείας');
      return null;
    }
  },
  
  // Λειτουργίες για ρυθμίσεις συναλλαγών
  async getTransactionSettings(userId: string): Promise<TransactionSettings | null> {
    try {
      const { data, error } = await supabase
        .from('transaction_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
      
      if (!data) {
        // Δημιουργία προεπιλεγμένων ρυθμίσεων αν δεν υπάρχουν
        return this.createTransactionSettings({
          user_id: userId,
          max_daily_amount: 1000,
          max_transaction_amount: 500,
          whitelist_only: false,
          delay_seconds: 0,
          notification_email: true,
          notification_app: true
        });
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching transaction settings:', error);
      toast.error('Σφάλμα κατά την ανάκτηση των ρυθμίσεων συναλλαγών');
      return null;
    }
  },
  
  async updateTransactionSettings(settings: TransactionSettings): Promise<TransactionSettings | null> {
    try {
      if (!settings.id) {
        return this.createTransactionSettings(settings);
      }
      
      const { data, error } = await supabase
        .from('transaction_settings')
        .update({
          max_daily_amount: settings.max_daily_amount,
          max_transaction_amount: settings.max_transaction_amount,
          whitelist_only: settings.whitelist_only,
          delay_seconds: settings.delay_seconds,
          notification_email: settings.notification_email,
          notification_app: settings.notification_app,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id)
        .select()
        .single();
        
      if (error) throw error;
      toast.success('Οι ρυθμίσεις συναλλαγών ενημερώθηκαν');
      return data;
    } catch (error) {
      console.error('Error updating transaction settings:', error);
      toast.error('Σφάλμα κατά την ενημέρωση των ρυθμίσεων συναλλαγών');
      return null;
    }
  },
  
  async createTransactionSettings(settings: TransactionSettings): Promise<TransactionSettings | null> {
    try {
      const { data, error } = await supabase
        .from('transaction_settings')
        .insert({
          user_id: settings.user_id,
          max_daily_amount: settings.max_daily_amount,
          max_transaction_amount: settings.max_transaction_amount,
          whitelist_only: settings.whitelist_only,
          delay_seconds: settings.delay_seconds,
          notification_email: settings.notification_email,
          notification_app: settings.notification_app
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating transaction settings:', error);
      toast.error('Σφάλμα κατά τη δημιουργία των ρυθμίσεων συναλλαγών');
      return null;
    }
  },
  
  // Λειτουργίες για εγκεκριμένες διευθύνσεις
  async getApprovedAddresses(userId: string): Promise<ApprovedAddress[]> {
    try {
      const { data, error } = await supabase
        .from('approved_addresses')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching approved addresses:', error);
      toast.error('Σφάλμα κατά την ανάκτηση των εγκεκριμένων διευθύνσεων');
      return [];
    }
  },
  
  async addApprovedAddress(address: ApprovedAddress): Promise<ApprovedAddress | null> {
    try {
      const { data, error } = await supabase
        .from('approved_addresses')
        .insert({
          user_id: address.user_id,
          address: address.address,
          description: address.description,
          blockchain: address.blockchain || 'solana'
        })
        .select()
        .single();
        
      if (error) throw error;
      toast.success('Η διεύθυνση προστέθηκε στις εγκεκριμένες');
      return data;
    } catch (error) {
      console.error('Error adding approved address:', error);
      toast.error('Σφάλμα κατά την προσθήκη της εγκεκριμένης διεύθυνσης');
      return null;
    }
  },
  
  async removeApprovedAddress(addressId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('approved_addresses')
        .delete()
        .eq('id', addressId);
        
      if (error) throw error;
      toast.success('Η διεύθυνση αφαιρέθηκε από τις εγκεκριμένες');
      return true;
    } catch (error) {
      console.error('Error removing approved address:', error);
      toast.error('Σφάλμα κατά την αφαίρεση της εγκεκριμένης διεύθυνσης');
      return false;
    }
  },
  
  // Λειτουργίες για συνεδρίες χρήστη
  async getUserSessions(userId: string): Promise<UserSession[]> {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('login_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      toast.error('Σφάλμα κατά την ανάκτηση των συνεδριών χρήστη');
      return [];
    }
  },
  
  async recordUserSession(userId: string, sessionData: Partial<UserSession>): Promise<UserSession | null> {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          device: sessionData.device,
          ip_address: sessionData.ip_address,
          location: sessionData.location,
          is_active: true
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error recording user session:', error);
      return null;
    }
  },
  
  async terminateSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({
          logout_at: new Date().toISOString(),
          is_active: false
        })
        .eq('id', sessionId);
        
      if (error) throw error;
      toast.success('Η συνεδρία τερματίστηκε');
      return true;
    } catch (error) {
      console.error('Error terminating session:', error);
      toast.error('Σφάλμα κατά τον τερματισμό της συνεδρίας');
      return false;
    }
  }
};
