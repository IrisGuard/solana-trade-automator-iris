
import { Token } from '@/types/wallet';

export const formatTokenAmount = (token: Token): string => {
  if (!token.amount) return "0";
  
  // For large numbers, show with fewer decimals
  if (token.amount >= 1000) {
    return token.amount.toFixed(2);
  }
  
  // For small numbers, show more decimals
  if (token.amount < 0.01) {
    return token.amount.toFixed(8);
  }
  
  return token.amount.toFixed(4);
};

export const formatAmount = (amount: number): string => {
  if (amount >= 1000) {
    return amount.toFixed(2);
  }
  
  if (amount < 0.01) {
    return amount.toFixed(8);
  }
  
  return amount.toFixed(4);
};
