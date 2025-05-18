
import { BrowserRouter } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { Toaster } from 'sonner';

// Components
import { AppErrorBoundary } from './components/errors';
import { AppFallbackComponent } from './components/errors/AppFallbackComponent';
import { SolanaProviderFallback } from './components/wallet/SolanaProviderFallback';

import './App.css';
import { GlobalErrorHandler } from './components/errors';
import { WalletProviderWrapper } from './components/wallet/WalletProviderWrapper';
import { initializeSystemApiKeys } from './utils/apiKeyInitializer';
import { AppProviders } from './providers/AppProviders';
import { Routes } from './routes';

function App() {
  // Initialize API endpoints on app launch
  useEffect(() => {
    initializeSystemApiKeys().catch(err => {
      console.error('Failed to initialize API endpoints:', err);
    });
  }, []);

  return (
    <AppErrorBoundary fallbackComponent={AppFallbackComponent}>
      <AppProviders>
        <GlobalErrorHandler />
        <BrowserRouter>
          <WalletProviderWrapper>
            <SolanaProviderFallback>
              <Routes />
            </SolanaProviderFallback>
          </WalletProviderWrapper>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </AppProviders>
    </AppErrorBoundary>
  );
}

export default App;
