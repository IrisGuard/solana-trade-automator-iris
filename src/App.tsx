
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './providers/ToastProvider';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { LanguageProvider } from './providers/LanguageProvider';
import { AppContent } from './components/AppContent';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  // Setup wallet adapters for Solana
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ToastProvider>
      <LanguageProvider defaultLanguage="el">
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </WalletModalProvider>
        </WalletProvider>
      </LanguageProvider>
    </ToastProvider>
  );
}

export default App;
