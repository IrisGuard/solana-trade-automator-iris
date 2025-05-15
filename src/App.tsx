
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { Layout } from './components/layout/Layout';
import { WalletProviderWrapper } from './components/wallet/WalletProviderWrapper';
import { SolanaWalletProvider } from './providers/SolanaWalletProvider';

// Pages
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import BotControl from './pages/BotControl';
import Index from './pages/Index';

function App() {
  return (
    <AppProviders>
      <WalletProviderWrapper>
        <SolanaWalletProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/home" element={<Layout><Home /></Layout>} />
              <Route path="/wallet" element={<Layout><Wallet /></Layout>} />
              <Route path="/bot-control" element={<Layout><BotControl /></Layout>} />
            </Routes>
          </Router>
        </SolanaWalletProvider>
      </WalletProviderWrapper>
    </AppProviders>
  );
}

export default App;
