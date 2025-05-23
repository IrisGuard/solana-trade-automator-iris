
export class BotTemplateService {
  async getTemplates() {
    return [
      {
        id: '1',
        name: 'DCA Bot',
        description: 'Dollar Cost Averaging strategy',
        strategy: 'dca'
      }
    ];
  }

  async getTemplate(id: string) {
    const templates = await this.getTemplates();
    return templates.find(t => t.id === id);
  }
}

export const botTemplateService = new BotTemplateService();
