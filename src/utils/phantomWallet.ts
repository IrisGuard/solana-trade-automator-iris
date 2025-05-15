
/**
 * Check if Phantom wallet is installed in the browser
 * @returns boolean indicating if Phantom is installed
 */
export const isPhantomInstalled = (): boolean => {
  // Check if window object is available (for SSR compatibility)
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Check if Phantom wallet exists in window.solana
  const phantom = (window as any).solana?.isPhantom;
  return !!phantom;
};
