import { type Token } from '@/types/wallet';
import { type TokenPrices } from '@/services/solana/price/types';

export interface MakerBotConfig {
  baseToken: Token | null;
  quoteToken: Token | null;
  spreadPercentage: number;
  orderQuantity: number;
  rebalanceThreshold: number;
}

export class MakerBotService {
  private _config: MakerBotConfig;
  
  constructor(config: MakerBotConfig) {
    this._config = config;
  }
  
  public setConfig(config: MakerBotConfig) {
    this._config = config;
  }
  
  public getConfig(): MakerBotConfig {
    return this._config;
  }
  
  // Example method to calculate order prices
  public calculateOrderPrices(tokenPrices: TokenPrices): { bidPrice: number; askPrice: number } | null {
    if (!this._config.baseToken || !this._config.quoteToken) {
      console.warn('Base or quote token not set in config.');
      return null;
    }

    const baseTokenPriceInfo = tokenPrices[this._config.baseToken.address];
    if (!baseTokenPriceInfo) {
      console.warn(`Price info not available for base token: ${this._config.baseToken.symbol}`);
      return null;
    }
    
    const spread = baseTokenPriceInfo.price * (this._config.spreadPercentage / 100);
    const bidPrice = baseTokenPriceInfo.price - spread;
    const askPrice = baseTokenPriceInfo.price + spread;
    
    return { bidPrice, askPrice };
  }
}
