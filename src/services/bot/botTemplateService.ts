
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export interface BotTemplate {
  id?: string;
  name: string;
  strategy: string;
  description?: string;
  default_config: Record<string, any>;
}

export const botTemplateService = {
  async getAllTemplates() {
    try {
      const { data, error } = await supabase
        .from('bot_templates')
        .select('*');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bot templates:', error);
      throw error;
    }
  },
  
  async getTemplateById(id: string) {
    try {
      const { data, error } = await supabase
        .from('bot_templates')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching bot template with id ${id}:`, error);
      throw error;
    }
  },

  async createTemplate(template: BotTemplate) {
    try {
      const newTemplate = {
        ...template,
        id: template.id || uuidv4(),
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('bot_templates')
        .insert([newTemplate])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating bot template:', error);
      throw error;
    }
  },
  
  async updateTemplate(id: string, template: Partial<BotTemplate>) {
    try {
      const updates = {
        ...template,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('bot_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating bot template with id ${id}:`, error);
      throw error;
    }
  },
  
  async deleteTemplate(id: string) {
    try {
      const { error } = await supabase
        .from('bot_templates')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting bot template with id ${id}:`, error);
      throw error;
    }
  }
};
