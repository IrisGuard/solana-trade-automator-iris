
import { Connection, PublicKey } from '@solana/web3.js';
import { toast } from 'sonner';
import { connection } from './config';

// Interface for price data
export interface TokenPriceData {
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: Date;
}

// Cache for token prices to reduce API calls
const priceCache: Record<string, { data: TokenPriceData, timestamp: number }> = {};
const CACHE_DURATION = 60 * 1000; // 60 seconds cache

export const priceService = {
  /**
   * Get real-time price data for a token
   */
  getTokenPrice: async (tokenAddress: string): Promise<TokenPriceData> => {
    try {
      // Check cache first
      const now = Date.now();
      if (priceCache[tokenAddress] && now - priceCache[tokenAddress].timestamp < CACHE_DURATION) {
        return priceCache[tokenAddress].data;
      }
      
      // For well-known tokens, we can fetch from API
      // In a production app, this would connect to Birdeye, Pyth or Jupiter API
      const knownPrices: Record<string, number> = {
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 1.0, // USDC
        'So11111111111111111111111111111111111111112': 80.45, // Wrapped SOL
        'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': 85.25, // mSOL
        '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R': 0.65, // RAY
      };
      
      // Simulate API call with some randomization
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const basePrice = knownPrices[tokenAddress] || Math.random() * 10;
      const priceChange = (Math.random() * 10) - 5; // Between -5% and +5%
      
      // Create price data
      const priceData: TokenPriceData = {
        price: basePrice,
        priceChange24h: priceChange,
        volume24h: basePrice * 1000000 * (Math.random() * 5 + 0.5),
        marketCap: basePrice * 10000000 * (Math.random() * 5 + 0.5),
        lastUpdated: new Date()
      };
      
      // Cache the result
      priceCache[tokenAddress] = {
        data: priceData,
        timestamp: now
      };
      
      return priceData;
    } catch (error) {
      console.error('Error fetching token price:', error);
      throw new Error('Failed to fetch token price');
    }
  },
  
  /**
   * Set up a price subscription for real-time updates
   * Returns a function to unsubscribe
   */
  subscribeToPriceUpdates: (tokenAddress: string, callback: (price: TokenPriceData) => void): (() => void) => {
    // In a production app, this would use WebSockets or polling with Birdeye/Jupiter
    const intervalId = setInterval(async () => {
      try {
        const price = await priceService.getTokenPrice(tokenAddress);
        callback(price);
      } catch (error) {
        console.error('Price subscription error:', error);
      }
    }, 15000); // Update every 15 seconds
    
    // Return unsubscribe function
    return () => clearInterval(intervalId);
  },
  
  /**
   * Get prices for multiple tokens at once
   */
  getBulkTokenPrices: async (tokenAddresses: string[]): Promise<Record<string, TokenPriceData>> => {
    try {
      const results: Record<string, TokenPriceData> = {};
      
      // For better performance, this would be a single API call in production
      await Promise.all(tokenAddresses.map(async (address) => {
        results[address] = await priceService.getTokenPrice(address);
      }));
      
      return results;
    } catch (error) {
      console.error('Error fetching bulk token prices:', error);
      throw new Error('Failed to fetch bulk token prices');
    }
  }
};
