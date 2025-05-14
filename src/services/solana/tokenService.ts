
import { Token } from '@/types/wallet';

// Mock service for fetching token information
export const fetchTokens = (): Promise<Token[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { address: 'So11111111111111111111111111111111111111112', name: 'Solana', symbol: 'SOL', amount: 1.5, decimals: 9, balance: 1.5, mint: 'So11111111111111111111111111111111111111112' },
        { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', name: 'USD Coin', symbol: 'USDC', amount: 100, decimals: 6, balance: 100, mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
        { address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', name: 'USDT', symbol: 'USDT', amount: 50, decimals: 6, balance: 50, mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' }
      ]);
    }, 1500);
  });
};

// Mock service for fetching token prices
export const fetchTokenPrices = (tokenAddresses: string[]): Promise<Record<string, number>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const prices: Record<string, number> = {};
      tokenAddresses.forEach(address => {
        prices[address] = Math.random() * 100; // Mock price
      });
      resolve(prices);
    }, 1000);
  });
};

// Mock service for fetching token details
export const fetchTokenDetails = (tokenAddress: string): Promise<Token> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      switch (tokenAddress) {
        case 'So11111111111111111111111111111111111111112':
          resolve({ address: tokenAddress, name: 'Solana', symbol: 'SOL', amount: 1.5, decimals: 9, balance: 1.5, mint: tokenAddress });
          break;
        case 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v':
          resolve({ address: tokenAddress, name: 'USD Coin', symbol: 'USDC', amount: 100, decimals: 6, balance: 100, mint: tokenAddress });
          break;
        default:
          reject(new Error(`Token not found: ${tokenAddress}`));
      }
    }, 800);
  });
};
