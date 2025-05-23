
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

// Use Mainnet for real crypto data display
const network = WalletAdapterNetwork.Mainnet;
const endpoint = clusterApiUrl(network);

const wallets = [
  new PhantomWalletAdapter(),
];

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
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
    </div>
  );
}

export default App;
