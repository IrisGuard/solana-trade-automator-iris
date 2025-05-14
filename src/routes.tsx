
import React, { Suspense } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

// Lazy-loaded pages
const Home = React.lazy(() => import("@/pages/Home"));
const Index = React.lazy(() => import("@/pages/Index"));
const Auth = React.lazy(() => import("@/pages/Auth"));
const BotControl = React.lazy(() => import("@/pages/BotControl"));
const Security = React.lazy(() => import("@/pages/Security"));
const Settings = React.lazy(() => import("@/pages/Settings"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));

// Loading component for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
  </div>
);

// Export the Routes component for use in AppContent
export const Routes = () => {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <Suspense fallback={<PageLoader />}>
              <Index />
            </Suspense>
          } />
          <Route path="home" element={
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
          } />
          <Route path="auth" element={
            <Suspense fallback={<PageLoader />}>
              <Auth />
            </Suspense>
          } />
          <Route path="bot-control" element={
            <Suspense fallback={<PageLoader />}>
              <BotControl />
            </Suspense>
          } />
          <Route path="security" element={
            <Suspense fallback={<PageLoader />}>
              <Security />
            </Suspense>
          } />
          <Route path="settings" element={
            <Suspense fallback={<PageLoader />}>
              <Settings />
            </Suspense>
          } />
          <Route path="*" element={
            <Suspense fallback={<PageLoader />}>
              <NotFound />
            </Suspense>
          } />
        </Route>
      </RouterRoutes>
    </BrowserRouter>
  );
};
