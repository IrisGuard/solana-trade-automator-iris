
import React, { useMemo, ReactNode } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { toast } from 'sonner';

// Import the default styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface SolanaWalletProviderProps {
  children: ReactNode;
}

export function SolanaWalletProvider({ children }: SolanaWalletProviderProps) {
  // Set up your Solana network to Devnet, Testnet, or Mainnet
  const network = WalletAdapterNetwork.Devnet;
  
  // Custom RPC endpoint (μπορεί να αλλάξει στο μέλλον με βάση τις ρυθμίσεις)
  const endpoint = useMemo(() => {
    // Χρησιμοποιούμε το backupEndpoint σε περίπτωση σφάλματος
    try {
      // Για την ώρα χρησιμοποιούμε το Devnet για αποφυγή χρεώσεων και σφαλμάτων
      return clusterApiUrl(network);
    } catch (error) {
      console.error("Error getting Solana endpoint:", error);
      return "https://api.devnet.solana.com"; // Fallback endpoint
    }
  }, [network]);
  
  // Initialize all the wallets you want to support
  const wallets = useMemo(() => {
    try {
      return [
        new PhantomWalletAdapter(),
        // Μπορούν να προστεθούν και άλλοι adapters στο μέλλον
      ];
    } catch (error) {
      console.error("Error initializing wallet adapters:", error);
      toast.error("Σφάλμα αρχικοποίησης των wallet adapters");
      return [];
    }
  }, []);

  // Ορισμός πρόσθετων παραμέτρων για το WalletProvider
  const walletProviderConfig = {
    wallets,
    autoConnect: false,
    onError: (error: Error) => {
      console.error("Wallet provider error:", error);
      toast.error("Σφάλμα παρόχου wallet", {
        description: error.message
      });
    }
  };

  // Return the wallet provider with connection
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider {...walletProviderConfig}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
