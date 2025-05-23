
import { BotCoreService } from './bot/botCoreService';
import { BotTemplateService } from './bot/botTemplateService';

// Export with correct names
export const botCoreService = new BotCoreService();
export const botTemplateService = new BotTemplateService();

// Also export classes for direct instantiation
export { BotCoreService, BotTemplateService };
