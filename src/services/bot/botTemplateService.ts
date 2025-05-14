
import { dbClient } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const botTemplateService = {
  async getBotTemplates() {
    try {
      const { data, error } = await dbClient
        .from('bot_templates')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching bot templates:', error);
      toast.error('Αποτυχία φόρτωσης προτύπων bot');
      return [];
    }
  },
  
  async createBotFromTemplate(userId: string, templateId: string, customName?: string) {
    try {
      // 1. Ανακτήστε το πρότυπο
      const { data: templateData, error: templateError } = await dbClient
        .from('bot_templates')
        .select('*')
        .eq('id', templateId)
        .single();
      
      if (templateError) throw templateError;
      
      const templates = templateData;
      
      if (!templates) {
        throw new Error('Template not found');
      }
      
      // 2. Δημιουργήστε ένα νέο bot με βάση το πρότυπο
      const botName = customName || `${templates.name} Bot`;
      const { data, error } = await dbClient
        .from('bots')
        .insert({
          user_id: userId,
          name: botName,
          strategy: templates.strategy,
          active: false,
          config: templates.default_config,
          created_at: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating bot from template:', error);
      toast.error('Αποτυχία δημιουργίας bot από πρότυπο');
      throw error;
    }
  }
};
