
import { toast } from 'sonner';

// Διορθώνουμε το interface
export interface PhantomWindow extends Window {
  phantom?: {
    solana?: {
      isPhantom: boolean;
      connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      on: (event: string, callback: Function) => void;
      off: (event: string, callback: Function) => void;
    };
  };
}

declare const window: PhantomWindow;

export const getPhantomWallet = () => {
  if (window?.phantom?.solana?.isPhantom) {
    return window.phantom.solana;
  }
  return null;
};

export const isPhantomInstalled = () => {
  return typeof window !== 'undefined' && window.phantom?.solana?.isPhantom || false;
};

export const connectPhantomWallet = async () => {
  try {
    const wallet = getPhantomWallet();
    if (!wallet) {
      toast.error('Phantom wallet not found. Please install it first.');
      window.open('https://phantom.app/', '_blank');
      return null;
    }
    
    const response = await wallet.connect();
    const publicKey = response.publicKey.toString();
    localStorage.setItem('walletConnected', 'true');
    localStorage.setItem('userDisconnected', 'false');
    
    return publicKey;
  } catch (error) {
    console.error('Error connecting to Phantom:', error);
    localStorage.setItem('walletConnected', 'false');
    localStorage.setItem('userDisconnected', 'true');
    toast.error('Failed to connect to Phantom wallet.');
    return null;
  }
};

export const connectTrustedPhantomWallet = async () => {
  try {
    const wallet = getPhantomWallet();
    if (!wallet) {
      return null;
    }
    
    const response = await wallet.connect({ onlyIfTrusted: true });
    return response.publicKey.toString();
  } catch (error) {
    console.error('Error connecting to trusted Phantom wallet:', error);
    return null;
  }
};

export const disconnectPhantomWallet = async () => {
  try {
    const wallet = getPhantomWallet();
    if (wallet) {
      await wallet.disconnect();
      localStorage.setItem('walletConnected', 'false');
      localStorage.setItem('userDisconnected', 'true');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error disconnecting from Phantom:', error);
    return false;
  }
};
