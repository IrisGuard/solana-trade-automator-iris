
export function isPhantomInstalled(): boolean {
  return typeof window !== 'undefined' && window.solana?.isPhantom;
}
