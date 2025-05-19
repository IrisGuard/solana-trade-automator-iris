
import React from "react";
import { Routes as RouterRoutes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

// Pages
import Index from "@/pages/Index";
import Home from "@/pages/Home";
import Wallet from "@/pages/Wallet";
import Dashboard from "@/pages/Dashboard";
import Tokens from "@/pages/Tokens";
import Transactions from "@/pages/Transactions";
import TransactionsEnhanced from "@/pages/TransactionsEnhanced";
import BotControl from "@/pages/BotControl";
import ApiVault from "@/pages/ApiVault";
import Settings from "@/pages/Settings";
import Security from "@/pages/Security";
import Help from "@/pages/Help";
import NotFound from "@/pages/NotFound";
import Bots from "@/pages/Bots";
import ChangeApproval from "@/pages/ChangeApproval";
import Portfolio from "@/pages/Portfolio";
import Notifications from "@/pages/Notifications";
import AddHeliusKeyPage from "@/pages/AddHeliusKey";
import TestAPI from "@/pages/TestAPI";

export function Routes() {
  return (
    <RouterRoutes>
      {/* Index page doesn't use the regular Layout */}
      <Route path="/" element={<Index />} />
      
      {/* Όλες οι υπόλοιπες σελίδες χρησιμοποιούν το κανονικό Layout */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transactions-enhanced" element={<TransactionsEnhanced />} />
        <Route path="/bot-control" element={<BotControl />} />
        <Route path="/api-vault" element={<ApiVault />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/security" element={<Security />} />
        <Route path="/help" element={<Help />} />
        <Route path="/bots" element={<Bots />} />
        <Route path="/change-approval" element={<ChangeApproval />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/add-helius-key" element={<AddHeliusKeyPage />} />
        <Route path="/test-api" element={<TestAPI />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </RouterRoutes>
  );
}
