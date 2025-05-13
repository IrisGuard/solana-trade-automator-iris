
/// <reference types="vite/client" />

// Extend Window interface to include Phantom wallet
interface Window {
  phantom?: {
    solana?: {
      isPhantom?: boolean;
      connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
    };
  };
  // Add Buffer and kB definitions
  Buffer: {
    alloc: (size: number, fill?: number) => Uint8Array;
    from: (data: any, encoding?: string) => Uint8Array;
  };
  kB: {
    alloc: (size: number, fill?: number) => Uint8Array;
    from: (data: any, encoding?: string) => Uint8Array;
  };
}
