
import { botCoreService } from './bot/botCoreService';
import { botTransactionService } from './bot/botTransactionService';
import { botPerformanceService } from './bot/botPerformanceService';
import { botTemplateService } from './bot/botTemplateService';

export const botsService = {
  // Core bot operations
  createBot: botCoreService.createBot,
  getBotsByUser: botCoreService.getAllBots, // Updated to match the correct method name
  updateBot: botCoreService.updateBot,
  deleteBot: botCoreService.deleteBot,
  
  // Bot transactions
  recordBotTransaction: botTransactionService.recordBotTransaction,
  getBotTransactions: botTransactionService.getBotTransactions,
  
  // Bot performance
  updateBotPerformance: botPerformanceService.updateBotPerformance,
  getBotPerformance: botPerformanceService.getBotPerformance,
  
  // Bot templates
  getBotTemplates: botTemplateService.getAllTemplates,
  createBotFromTemplate: botTemplateService.createBotFromTemplate
};
