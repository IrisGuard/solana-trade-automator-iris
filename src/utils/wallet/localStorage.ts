
/**
 * Local storage utilities for wallet management
 */

/**
 * Save wallet to localStorage for quick reconnect
 */
export const saveWalletToLocalStorage = (address: string): void => {
  localStorage.setItem('phantom_wallet', JSON.stringify({
    address,
    timestamp: Date.now()
  }));
};

/**
 * Get wallet from localStorage
 */
export const getWalletFromLocalStorage = (): { address: string, timestamp: number } | null => {
  const storedWallet = localStorage.getItem('phantom_wallet');
  if (!storedWallet) return null;
  
  try {
    return JSON.parse(storedWallet);
  } catch (e) {
    console.error('Error parsing stored wallet data:', e);
    return null;
  }
};

/**
 * Remove wallet from localStorage
 */
export const removeWalletFromLocalStorage = (): void => {
  localStorage.removeItem('phantom_wallet');
};
