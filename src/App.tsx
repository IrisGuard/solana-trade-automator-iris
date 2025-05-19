
import { BrowserRouter } from 'react-router-dom';
import { Suspense, useEffect } from 'react';

// Components
import { AppErrorBoundary } from './components/errors';
import { AppFallbackComponent } from './components/errors/AppFallbackComponent';
import { SolanaProviderFallback } from './components/wallet/SolanaProviderFallback';

import './App.css';
import { GlobalErrorHandler } from './components/errors';
import { WalletProviderWrapper } from './components/wallet/WalletProviderWrapper';
import { AppProviders } from './providers/AppProviders';
import { Routes } from './routes';
import { toast } from 'sonner';
import { DatabaseInitializeButton } from './components/database/DatabaseInitializeButton';

function App() {
  // Show welcome toast only once on app launch
  useEffect(() => {
    try {
      console.log('App component mounted successfully');
      
      // Check if we're on the root route and show a welcome toast
      if (window.location.pathname === '/' && !sessionStorage.getItem('welcome_shown')) {
        toast.success('Καλώς ήρθατε στο Solana Trade Automator!', {
          duration: 5000,
          action: {
            label: 'Αρχικοποίηση',
            onClick: () => {
              document.getElementById('initialize-db-button')?.click();
            }
          }
        });
        sessionStorage.setItem('welcome_shown', 'true');
      }
    } catch (error) {
      console.error('Error in App initialization:', error);
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
                <div className="fixed top-4 right-4 z-50">
                  <div id="initialize-db-button">
                    <DatabaseInitializeButton />
                  </div>
                </div>
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
