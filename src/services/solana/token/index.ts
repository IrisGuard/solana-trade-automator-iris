
import type { Token } from '@/types/wallet';
import { fetchSOLBalance } from '../wallet/balance';
import { fetchTokenPrices } from './prices';

// Re-export token types
export type { Token };

// Export token-related functions
export const fetchTokenBalance = async (address: string, tokenAddress: string): Promise<number> => {
  // Implementation for fetching a single token's balance
  console.log(`Would fetch balance for token ${tokenAddress} in wallet ${address}`);
  return 0;
};

export const fetchAllTokenBalances = async (address: string): Promise<Token[]> => {
  // Implementation for fetching all token balances
  console.log(`Would fetch all tokens for wallet ${address}`);
  return [];
};

// Export token service object
export const tokenService = {
  fetchSOLBalance,
  fetchTokenPrices,
  fetchTokenBalance,
  fetchAllTokenBalances
};
