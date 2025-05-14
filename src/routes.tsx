
import React, { Suspense } from 'react';
import { Route, Routes as RouterRoutes, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

// Import pages
const HomePage = React.lazy(() => import('@/pages/Home'));
const IndexPage = React.lazy(() => import('@/pages/Index'));
const DashboardPage = React.lazy(() => import('@/pages/Dashboard'));
const WalletPage = React.lazy(() => import('@/pages/Wallet'));
const PortfolioPage = React.lazy(() => import('@/pages/Portfolio'));
const TransactionsPage = React.lazy(() => import('@/pages/Transactions'));
const TransactionsEnhancedPage = React.lazy(() => import('@/pages/TransactionsEnhanced'));
const TokensPage = React.lazy(() => import('@/pages/Tokens'));
const BotsPage = React.lazy(() => import('@/pages/Bots'));
const BotControlPage = React.lazy(() => import('@/pages/BotControl'));
const ApiVaultPage = React.lazy(() => import('@/pages/ApiVault'));
const HelpPage = React.lazy(() => import('@/pages/Help'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFound'));
const AuthPage = React.lazy(() => import('@/pages/Auth'));

// Loading component
const PageLoading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
  </div>
);

// Define the Routes component
export function Routes() {
  return (
    <Suspense fallback={<PageLoading />}>
      <RouterRoutes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Authenticated Pages with Layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/transactions-enhanced" element={<TransactionsEnhancedPage />} />
          <Route path="/tokens" element={<TokensPage />} />
          <Route path="/bots" element={<BotsPage />} />
          <Route path="/bot-control" element={<BotControlPage />} />
          <Route path="/api-vault" element={<ApiVaultPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Route>
        
        {/* Fallback routes */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </RouterRoutes>
    </Suspense>
  );
}
