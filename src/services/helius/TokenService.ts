
import { HELIUS_BASE_URL } from './HeliusConfig';
import { heliusKeyManager } from './HeliusKeyManager';

class TokenService {
  private apiKey: string | null = null;
  
  private getApiKey(): string {
    this.apiKey = heliusKeyManager.getApiKey();
    if (!this.apiKey) {
      throw new Error('Helius API key is not available');
    }
    return this.apiKey;
  }
  
  public async getTokenBalances(walletAddress: string) {
    try {
      console.log(`Fetching token balances for wallet: ${walletAddress}`);
      
      // For demo purposes, return mock data
      return [
        {
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          amount: 500.0,
          decimals: 6
        },
        {
          mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
          amount: 250.5,
          decimals: 6
        },
        {
          mint: 'So11111111111111111111111111111111111111112',
          amount: 12.5,
          decimals: 9
        }
      ];
    } catch (error) {
      console.error('Error fetching token balances:', error);
      return [];
    }
  }
  
  public async getTokenMetadata(tokenAddresses: string[]) {
    try {
      console.log(`Fetching token metadata for: ${tokenAddresses.join(', ')}`);
      
      // For demo purposes, return mock data
      return [
        {
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          name: 'USD Coin',
          symbol: 'USDC',
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
        },
        {
          mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
          name: 'USDT',
          symbol: 'USDT',
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png'
        },
        {
          mint: 'So11111111111111111111111111111111111111112',
          name: 'Wrapped SOL',
          symbol: 'SOL',
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
        }
      ];
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      return [];
    }
  }
}

export const tokenService = new TokenService();
export type { TokenService };
