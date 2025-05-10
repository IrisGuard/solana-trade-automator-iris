
export type Transaction = {
  signature: string;
  blockTime: number;
  type: string;
  status: string;
  amount: string;
  from: string;
  to: string;
};

export type Token = {
  address: string;
  name: string;
  symbol: string;
  amount: number;
  logo?: string;
};

// Add Phantom wallet type definitions
declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom: boolean;
        connect: (options?: { onlyIfTrusted: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
        disconnect: () => Promise<void>;
      };
    };
  }
}
