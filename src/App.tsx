
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/navigation/Navbar';
import { HomePage } from './pages/HomePage';
import { WalletPage } from './pages/WalletPage';
import { DashboardPage } from './pages/DashboardPage';
import { AppContent } from './components/AppContent';
import { ToastProvider } from './providers/ToastProvider';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

// Create our custom WalletConnectProvider that wraps the Solana wallet adapter
import { WalletConnectProvider } from './providers/WalletConnectProvider';

function App() {
  // Setup wallet adapters for Solana
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ToastProvider>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletConnectProvider>
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/wallet" element={<WalletPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="*" element={<AppContent />} />
                  </Routes>
                </main>
              </div>
            </BrowserRouter>
          </WalletConnectProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ToastProvider>
  );
}

export default App;
