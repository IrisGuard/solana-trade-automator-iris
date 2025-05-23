
import { BotCoreService } from './bot/botCoreService';
import { BotTemplateService } from './bot/botTemplateService';

// Create service instances
const botCoreService = new BotCoreService();
const botTemplateService = new BotTemplateService();

// Create a unified bots service that combines both core and template functionality
export const botsService = {
  // Bot creation and management
  async createBot(botData: any) {
    return botCoreService.createBot(botData);
  },

  async getBots(userId: string) {
    return botCoreService.getBots(userId);
  },

  async updateBot(botId: string, updates: any) {
    return botCoreService.updateBot(botId, updates);
  },

  async deleteBot(botId: string) {
    return botCoreService.deleteBot(botId);
  },

  async startBot(botId: string) {
    return botCoreService.startBot(botId);
  },

  async stopBot(botId: string) {
    return botCoreService.stopBot(botId);
  },

  // Template management
  async getBotTemplates() {
    return botTemplateService.getTemplates();
  },

  async getBotTemplate(id: string) {
    return botTemplateService.getTemplate(id);
  }
};

// Export with correct names for compatibility
export { botCoreService, botTemplateService };

// Also export classes for direct instantiation
export { BotCoreService, BotTemplateService };
