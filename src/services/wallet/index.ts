
import { Token } from '@/types/wallet';

/**
 * Fetch wallet data including tokens
 */
export async function fetchWalletData(walletAddress: string) {
  try {
    console.log(`Fetching wallet data for ${walletAddress}`);
    
    // Mock data - in a real app, this would be an API call
    const tokens: Token[] = [
      { address: 'sol1', symbol: 'SOL', name: 'Solana', amount: 2.5, decimals: 9, mint: 'sol1' },
      { address: 'ray1', symbol: 'RAY', name: 'Raydium', amount: 100, decimals: 6, mint: 'ray1' },
      { address: 'usdc1', symbol: 'USDC', name: 'USD Coin', amount: 500, decimals: 6, mint: 'usdc1' }
    ];
    
    return { tokens };
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    return null;
  }
}
