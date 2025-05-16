
import { Token } from '../token/types';
import { heliusService } from '@/services/helius/HeliusService';
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Initialize connection
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Fetch token balance for a specific token
export const fetchTokenBalance = async (wallet: string, tokenAddress: string): Promise<number> => {
  console.log(`Fetching balance for token ${tokenAddress} in wallet ${wallet}`);
  
  try {
    const tokenBalances = await heliusService.fetchTokenBalances(wallet);
    const token = tokenBalances.find(t => t.mint === tokenAddress);
    return token?.amount || 0;
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return 0;
  }
};

// Fetch all token balances for a wallet
export const fetchAllTokenBalances = async (walletAddress: string): Promise<Token[]> => {
  console.log(`Fetching all token balances for wallet ${walletAddress}`);
  
  try {
    // Try using Helius service
    const tokenBalances = await heliusService.fetchTokenBalances(walletAddress);
    
    if (!tokenBalances || !tokenBalances.length) {
      console.log('No tokens found or empty response from Helius');
      return [];
    }
    
    // Get metadata for tokens
    const tokenAddresses = tokenBalances.map(t => t.mint);
    const tokenMetadataList = await heliusService.getTokenMetadata(tokenAddresses);
    
    // Create a map for easy lookup
    const tokenMetadataMap = tokenMetadataList.reduce((acc, token) => {
      acc[token.mint] = token;
      return acc;
    }, {} as Record<string, any>);
    
    // Process token data
    return tokenBalances.map(token => {
      const metadata = tokenMetadataMap[token.mint] || {};
      return {
        address: token.mint,
        symbol: metadata.symbol || 'Unknown',
        name: metadata.name || 'Unknown Token',
        amount: token.amount || 0,
        decimals: token.decimals || 9,
        logo: metadata.logoURI || ''
      };
    }).filter(token => token.amount > 0); // Filter out zero-balance tokens
  } catch (error) {
    console.error('Error fetching all token balances:', error);
    return [];
  }
};

// Export the tokenService object with real implementations
export const tokenService = {
  fetchTokens: async (address: string): Promise<Token[]> => {
    console.log(`Fetching tokens for address: ${address}`);
    return fetchAllTokenBalances(address);
  },
  fetchTokenPrices: async (addresses: string[]) => {
    console.log(`Fetching prices for tokens: ${addresses.join(', ')}`);
    
    // In a real implementation, this would call a price API
    // For now, generate semi-realistic prices
    const prices: Record<string, { price: number, priceChange24h: number }> = {};
    
    addresses.forEach(address => {
      // Use the last character of the address to generate a "stable" random price
      // so the same token always gets the same price in a session
      const lastChar = address.slice(-1);
      const baseValue = parseInt(lastChar, 16) || 5;
      
      prices[address] = {
        price: baseValue * 10 + Math.random() * 5,
        priceChange24h: (Math.random() * 6) - 3 // Between -3% and +3%
      };
    });
    
    return prices;
  }
};
