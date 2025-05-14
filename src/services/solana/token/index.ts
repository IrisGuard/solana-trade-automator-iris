
import type { Token } from '@/types/wallet';
import { fetchSOLBalance } from '../wallet/balance';
import { fetchTokenPrices } from './prices';

// Re-export token types
export type { Token };

// Export token-related functions
export const tokenService = {
  fetchSOLBalance,
  fetchTokenPrices
};
