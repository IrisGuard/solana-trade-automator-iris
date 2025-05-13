
/// <reference types="vite/client" />

// Global Buffer definition
interface Window {
  Buffer: typeof Buffer;
  phantom?: {
    solana?: any;
  };
}
