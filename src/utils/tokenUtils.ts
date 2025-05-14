
import { Token } from "@/types/wallet";

/**
 * Format token amounts with proper decimals for display
 */
export function formatTokenAmount(token: Token | number, decimals: number = 4): string {
  // Handle the case where a number is passed directly
  if (typeof token === 'number') {
    return token.toFixed(decimals);
  }

  // Handle the case where a Token object is passed
  if (!token || token.amount === undefined) {
    return "0.0000"; // Default value when token or amount is undefined
  }

  // First convert to number if it's a string
  const amountNumber = typeof token.amount === 'string' ? parseFloat(token.amount) : token.amount;
  
  // Handle NaN or undefined cases
  if (isNaN(amountNumber) || amountNumber === undefined) {
    return "0.0000";
  }

  try {
    return amountNumber.toFixed(decimals);
  } catch (error) {
    console.error("Error formatting token amount:", error);
    return "0.0000";
  }
}

/**
 * Format price change with + or - sign
 */
export function formatPriceChange(change: number): string {
  if (!change) return "0.00%";
  
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}

/**
 * Calculate token value in USD based on price
 */
export function calculateTokenValue(token: Token, price?: number): number {
  if (!token?.amount || price === undefined || isNaN(price)) {
    return 0;
  }
  
  const amount = typeof token.amount === 'string' ? parseFloat(token.amount) : token.amount;
  return amount * price;
}
