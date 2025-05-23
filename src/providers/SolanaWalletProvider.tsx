
import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

interface SolanaWalletProviderProps {
  children: React.ReactNode;
}

export function SolanaWalletProvider({ children }: SolanaWalletProviderProps) {
  // Χρήση mainnet-beta για production
  const network = WalletAdapterNetwork.Mainnet;
  
  // RPC endpoint - χρήση του κύριου mainnet endpoint
  const endpoint = useMemo(() => {
    try {
      return clusterApiUrl(network);
    } catch (error) {
      console.error('Error getting cluster API URL:', error);
      return 'https://api.mainnet-beta.solana.com';
    }
  }, [network]);

  // Λίστα των υποστηριζόμενων wallets
  const wallets = useMemo(() => {
    try {
      return [
        new PhantomWalletAdapter(),
      ];
    } catch (error) {
      console.error('Error initializing wallets:', error);
      return [];
    }
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
