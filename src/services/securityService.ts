
import { supabase } from '@/integrations/supabase/client';

export interface SecuritySettings {
  id?: string;
  user_id: string;
  setting_name: string;
  is_enabled: boolean;
}

export const securityService = {
  async getSecuritySettings(userId: string) {
    const { data, error } = await supabase
      .from('security_settings')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching security settings:', error);
      throw error;
    }
    
    return data || [];
  },
  
  async createSecuritySetting(setting: Omit<SecuritySettings, 'id'>) {
    const { data, error } = await supabase
      .from('security_settings')
      .insert([setting])
      .select('*')
      .single();
      
    if (error) {
      console.error('Error creating security setting:', error);
      throw error;
    }
    
    return data;
  },
  
  async updateSecuritySetting(id: string, isEnabled: boolean) {
    const { data, error } = await supabase
      .from('security_settings')
      .update({ is_enabled: isEnabled })
      .eq('id', id)
      .select('*')
      .single();
      
    if (error) {
      console.error('Error updating security setting:', error);
      throw error;
    }
    
    return data;
  },
  
  async deleteSecuritySetting(id: string) {
    const { error } = await supabase
      .from('security_settings')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting security setting:', error);
      throw error;
    }
    
    return true;
  }
};
