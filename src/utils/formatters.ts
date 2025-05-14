
/**
 * Format a wallet address to display format (truncated)
 * @param address The full wallet address
 * @returns Truncated address for display
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  
  if (address.length < 10) return address;
  
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
}

/**
 * Format currency value to display format
 * @param value The amount to format
 * @param currency The currency symbol
 * @param decimals Number of decimal places
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency: string = 'USD', decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format percentage value
 * @param value The percentage value
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format date to display format
 * @param date The date to format
 * @param includeTime Whether to include time
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | number, includeTime: boolean = false): string {
  const dateObj = new Date(date);
  
  if (includeTime) {
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
