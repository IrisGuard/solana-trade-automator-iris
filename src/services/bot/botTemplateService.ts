
import { supabase } from '@/lib/supabase';
import { botCoreService } from './botCoreService';

export interface BotTemplate {
  id: string;
  name: string;
  description?: string;
  strategy: string;
  default_config: Record<string, any>;
  created_at?: string;
}

export const botTemplateService = {
  // Get all bot templates
  getAllTemplates: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('bot_templates')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  },
  
  // Get a specific template by ID
  getTemplateById: async (id: string): Promise<any> => {
    const { data, error } = await supabase
      .from('bot_templates')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Create a new bot template
  createTemplate: async (template: BotTemplate): Promise<any> => {
    const { data, error } = await supabase
      .from('bot_templates')
      .insert(template)
      .select('*')
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Update an existing template
  updateTemplate: async (id: string, template: Partial<BotTemplate>): Promise<any> => {
    const { data, error } = await supabase
      .from('bot_templates')
      .update(template)
      .eq('id', id)
      .select('*')
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Delete a template
  deleteTemplate: async (id: string): Promise<any> => {
    const { error } = await supabase
      .from('bot_templates')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return { success: true };
  },

  // Create a bot from a template
  createBotFromTemplate: async (userId: string, templateId: string, customName?: string): Promise<any[]> => {
    try {
      // Get the template
      const template = await botTemplateService.getTemplateById(templateId);
      
      if (!template) {
        throw new Error("Template not found");
      }
      
      // Create the bot with template defaults
      const botName = customName || `${template.name} Bot`;
      
      const result = await botCoreService.createBot(userId, {
        name: botName,
        strategy: template.strategy,
        active: false,
        config: template.default_config
      });
      
      return Array.isArray(result) ? result : [result];
    } catch (error) {
      console.error("Error creating bot from template:", error);
      throw error;
    }
  }
};
