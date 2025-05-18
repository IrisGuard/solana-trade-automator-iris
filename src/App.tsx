
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from 'sonner';

// Components
import { Layout } from './components/layout/Layout';
import { AppErrorBoundary } from './components/errors';
import { AppFallbackComponent } from './components/errors/AppFallbackComponent';
import { SolanaProviderFallback } from './components/wallet/SolanaProviderFallback';

// Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Security = lazy(() => import('./pages/Security'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Wallet = lazy(() => import('./pages/Wallet'));
const Bots = lazy(() => import('./pages/Bots'));
const ApiVault = lazy(() => import('./pages/ApiVault'));
const Help = lazy(() => import('./pages/Help'));
const AddHeliusKeyPage = lazy(() => import('./pages/AddHeliusKey'));

import './App.css';
import { GlobalErrorHandler } from './components/errors';
import { WalletProviderWrapper } from './components/wallet/WalletProviderWrapper';

function App() {
  return (
    <AppErrorBoundary fallbackComponent={AppFallbackComponent}>
      <GlobalErrorHandler />
      <BrowserRouter>
        <WalletProviderWrapper>
          <SolanaProviderFallback>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <Dashboard />
                  </Suspense>
                } />
                <Route path="wallet" element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <Wallet />
                  </Suspense>
                } />
                <Route path="transactions" element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <Transactions />
                  </Suspense>
                } />
                <Route path="bots" element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <Bots />
                  </Suspense>
                } />
                <Route path="api-vault" element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <ApiVault />
                  </Suspense>
                } />
                <Route path="settings" element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <Settings />
                  </Suspense>
                } />
                <Route path="security" element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <Security />
                  </Suspense>
                } />
                <Route path="help" element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <Help />
                  </Suspense>
                } />
                <Route path="add-helius-key" element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <AddHeliusKeyPage />
                  </Suspense>
                } />
              </Route>
            </Routes>
          </SolanaProviderFallback>
        </WalletProviderWrapper>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </AppErrorBoundary>
  );
}

export default App;
