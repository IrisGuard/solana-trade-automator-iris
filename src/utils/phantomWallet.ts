
export function isPhantomInstalled(): boolean {
  const phantom = window.phantom?.solana;
  return !!phantom && !!phantom.isPhantom;
}

// Add a global type for Phantom
declare global {
  interface Window {
    phantom?: {
      solana: {
        isPhantom: boolean;
        connect: () => Promise<{ publicKey: { toString: () => string } }>;
        disconnect: () => Promise<void>;
        isConnected: boolean;
      };
    };
  }
}
