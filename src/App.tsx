
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { Routes } from './routes';
import { WalletProviderWrapper } from './components/wallet/WalletProviderWrapper';
import { SolanaWalletProvider } from './providers/SolanaWalletProvider';

function App() {
  return (
    <AppProviders>
      <WalletProviderWrapper>
        <SolanaWalletProvider>
          <Router>
            <Routes />
          </Router>
        </SolanaWalletProvider>
      </WalletProviderWrapper>
    </AppProviders>
  );
}

export default App;
