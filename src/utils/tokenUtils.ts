
/**
 * Format token amount based on decimals
 */
export const formatTokenAmount = (amount: number, decimals: number = 0): string => {
  const precision = decimals > 0 ? Math.min(decimals, 6) : 2;
  return amount.toFixed(precision);
};

/**
 * Format token price to USD format
 */
export const formatTokenPrice = (price: number | undefined): string => {
  if (price === undefined || isNaN(price)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(price);
};

/**
 * Calculate USD value from token amount and price
 */
export const calculateUSDValue = (amount: number, price: number | undefined): string => {
  if (!price || isNaN(price)) return '$0.00';
  return formatTokenPrice(amount * price);
};

/**
 * Format token symbol with ellipsis if too long
 */
export const formatTokenSymbol = (symbol: string, maxLength: number = 6): string => {
  return symbol.length > maxLength ? `${symbol.slice(0, maxLength)}...` : symbol;
};
