
import { BotConfig } from './botCoreService';

export interface BotTemplate {
  id: string;
  name: string;
  description: string;
  config: Partial<BotConfig>;
  tags: string[];
}

// Simple bot templates
const BOT_TEMPLATES: BotTemplate[] = [
  {
    id: 'simple-trader',
    name: 'Simple Trader',
    description: 'Basic trading bot with minimal configuration',
    config: {
      strategies: ['simple'],
      tradeSize: 0.1,
      maxTrades: 10,
      stopLoss: 5,
      takeProfit: 10,
      interval: 30000
    },
    tags: ['beginner', 'low risk']
  },
  {
    id: 'dca-bot',
    name: 'DCA Bot',
    description: 'Dollar-cost averaging bot for long-term investments',
    config: {
      strategies: ['dca'],
      tradeSize: 0.05,
      maxTrades: 100,
      stopLoss: 0,
      takeProfit: 0,
      interval: 3600000
    },
    tags: ['long-term', 'dca']
  }
];

export function getTemplates(): BotTemplate[] {
  return BOT_TEMPLATES;
}

export function getTemplateById(id: string): BotTemplate | undefined {
  return BOT_TEMPLATES.find(template => template.id === id);
}

export function createConfigFromTemplate(templateId: string, walletAddress: string): Partial<BotConfig> {
  const template = getTemplateById(templateId);
  
  if (!template) {
    throw new Error(`Template with id ${templateId} not found`);
  }
  
  return {
    ...template.config,
    walletAddress
  };
}
