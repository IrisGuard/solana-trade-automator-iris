
import React, { Suspense } from 'react';
import { Route, Routes as RouterRoutes, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';

// Import pages
const HomePage = React.lazy(() => import('@/pages/Home'));
const IndexPage = React.lazy(() => import('@/pages/Index'));
const WalletPage = React.lazy(() => import('@/pages/Wallet'));
const BotControlPage = React.lazy(() => import('@/pages/BotControl'));
const HelpPage = React.lazy(() => import('@/pages/Help'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFound'));

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
        
        {/* Authenticated Pages with Layout */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/bot-control" element={<BotControlPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Route>
        
        {/* Fallback routes */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </RouterRoutes>
    </Suspense>
  );
}
