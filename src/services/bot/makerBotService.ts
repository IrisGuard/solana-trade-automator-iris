
import { type Token } from '@/types/wallet';
import { type TokenPrices } from '@/services/solana/price/types';

export interface MakerBotConfig {
  baseToken: Token | null;
  quoteToken: Token | null;
  spreadPercentage: number;
  orderQuantity: number;
  rebalanceThreshold: number;
  isSimulation: boolean;
  makers: number;
  minDelay: number;
  maxDelay: number;
  tokenAmount: number;
  solAmount: number;
  selectedToken?: string;
}

export interface BoostConfig {
  boostPercentage: number;
  duration: number;
  gradual: boolean;
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

  // Add functions being used in MakerBotTab
  public async startBot(walletAddress: string, config: MakerBotConfig): Promise<boolean> {
    console.log(`Starting bot for wallet ${walletAddress} with config:`, config);
    // Simulation of async operation
    return new Promise(resolve => setTimeout(() => resolve(true), 500));
  }

  public async stopBot(walletAddress: string): Promise<boolean> {
    console.log(`Stopping bot for wallet ${walletAddress}`);
    // Simulation of async operation
    return new Promise(resolve => setTimeout(() => resolve(true), 500));
  }

  public async boostPrice(walletAddress: string, tokenAddress: string, boostConfig: BoostConfig): Promise<boolean> {
    console.log(`Boosting price for token ${tokenAddress} with config:`, boostConfig);
    // Simulation of async operation
    return new Promise(resolve => setTimeout(() => resolve(true), 500));
  }
}

// Create and export an instance of the service with default config
export const makerBotService = new MakerBotService({
  baseToken: null,
  quoteToken: null,
  spreadPercentage: 2,
  orderQuantity: 100,
  rebalanceThreshold: 5,
  isSimulation: true,
  makers: 5,
  minDelay: 10,
  maxDelay: 30,
  tokenAmount: 100,
  solAmount: 0.1
});
