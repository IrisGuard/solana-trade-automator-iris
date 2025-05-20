
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
import { StatusSection } from './components/dashboard/StatusSection';
import { ensureAuthenticated } from './integrations/supabase/client';
import { autoInitialize } from './utils/autoInitialize';
import { sanitizeErrorObject } from './utils/errorTestUtils';

function App() {
  // Auto-initialize once on app launch
  useEffect(() => {
    try {
      console.log('App component mounted successfully');
      
      const initializeApp = async () => {
        // Ensure authentication
        const isAuthenticated = await ensureAuthenticated();
        
        if (isAuthenticated) {
          console.log('User authenticated, checking if database needs initialization...');
          
          // Show toast notification
          toast.success('Καλώς ήρθατε στο Solana Trade Automator!', {
            duration: 5000,
            action: {
              label: 'Άμεση Ενεργοποίηση',
              onClick: () => {
                autoInitialize();
              }
            }
          });
          
          // Auto-initialize only on first load (not on hot reload during development)
          if (!window.localStorage.getItem('app_initialized')) {
            console.log('Starting auto-initialization...');
            await autoInitialize();
            window.localStorage.setItem('app_initialized', 'true');
          }
        } else {
          console.log('Authentication failed, manual initialization will be required');
          toast.error('Αδυναμία αυτόματης σύνδεσης. Παρακαλώ κάντε χειροκίνητη σύνδεση.', {
            duration: 8000
          });
        }
      };
      
      initializeApp();
    } catch (error) {
      // Sanitize the error before logging it
      const sanitizedError = sanitizeErrorObject(error);
      console.error('Error in App initialization:', sanitizedError);
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
