
import { Token } from '@/types/wallet';

/**
 * Formats a token amount with the correct decimals and symbol
 * @param token The token object containing amount, decimals, and symbol
 * @returns Formatted token amount as string
 */
export const formatTokenAmount = (token: Token): string => {
  if (!token) return '0';
  
  const amount = token.amount || 0;
  const decimals = token.decimals || 0;
  const formattedAmount = (amount / Math.pow(10, decimals)).toFixed(decimals > 4 ? 4 : decimals);
  
  return `${formattedAmount} ${token.symbol}`;
};

/**
 * Format just an amount based on decimals
 * @param amount The numerical amount
 * @param decimals The number of decimal places
 * @returns Formatted amount as string
 */
export const formatAmount = (amount: number, decimals: number): string => {
  if (typeof amount !== 'number' || typeof decimals !== 'number') {
    return '0';
  }
  
  const formattedAmount = (amount / Math.pow(10, decimals)).toFixed(decimals > 4 ? 4 : decimals);
  return formattedAmount;
};

/**
 * Format price change with '+' or '-' sign and '%'
 * @param change The price change percentage
 * @returns Formatted price change as string with sign
 */
export const formatPriceChange = (change?: number): string => {
  if (!change && change !== 0) return '0%';
  
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
};

/**
 * Calculate token value in USD
 * @param amount The token amount
 * @param price The token price in USD
 * @param decimals The number of decimal places
 * @returns Calculated value in USD
 */
export const calculateTokenValue = (
  amount: number, 
  price?: number, 
  decimals?: number
): number => {
  if (!amount || !price) return 0;
  
  const actualAmount = decimals ? amount / Math.pow(10, decimals) : amount;
  return actualAmount * price;
};
