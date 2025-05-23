
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { SupabaseAuthProvider } from "@/providers/SupabaseAuthProvider";
import { MonitoringSystem } from "@/components/monitoring/MonitoringSystem";
import MainDashboard from "./pages/MainDashboard";

import '@solana/wallet-adapter-react-ui/styles.css';
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Use Devnet to prevent real transactions (DEMO ONLY)
const network = WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);

const wallets = [
  new PhantomWalletAdapter(),
];

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <BrowserRouter>
                <MonitoringSystem />
                <MainDashboard />
                <Toaster />
              </BrowserRouter>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
