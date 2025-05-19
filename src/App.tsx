
import { BrowserRouter } from 'react-router-dom';
import { Suspense, useEffect } from 'react';

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
import { toast } from 'sonner';

function App() {
  // Initialize API endpoints on app launch
  useEffect(() => {
    try {
      console.log('Initializing system API keys...');
      initializeSystemApiKeys().catch(err => {
        console.error('Failed to initialize API endpoints:', err);
      });
      console.log('App component mounted successfully');
    } catch (error) {
      console.error('Error in App initialization:', error);
    }
    
    // Check if we're on the root route and show a welcome toast
    if (window.location.pathname === '/') {
      toast.success('Καλώς ήρθατε στο Solana Trade Automator!', {
        duration: 5000
      });
    }
    
    return () => {
      console.log('App component unmounting');
    };
  }, []);

  return (
    <AppErrorBoundary fallbackComponent={AppFallbackComponent}>
      <AppProviders>
        <GlobalErrorHandler />
        <BrowserRouter>
          <WalletProviderWrapper>
            <SolanaProviderFallback>
              <Suspense fallback={<div className="flex items-center justify-center h-screen">Φόρτωση...</div>}>
                <Routes />
              </Suspense>
            </SolanaProviderFallback>
          </WalletProviderWrapper>
        </BrowserRouter>
      </AppProviders>
    </AppErrorBoundary>
  );
}

export default App;
