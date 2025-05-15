
import React from "react";
import { Routes as RouterRoutes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

// Pages
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
import Index from "@/pages/Index";
import Bots from "@/pages/Bots";
import ChangeApproval from "@/pages/ChangeApproval";
import Portfolio from "@/pages/Portfolio";
import Notifications from "@/pages/Notifications";

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<Layout><Index /></Layout>} />
      <Route path="/home" element={<Layout><Home /></Layout>} />
      <Route path="/wallet" element={<Layout><Wallet /></Layout>} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/tokens" element={<Layout><Tokens /></Layout>} />
      <Route path="/transactions" element={<Layout><Transactions /></Layout>} />
      <Route path="/transactions-enhanced" element={<Layout><TransactionsEnhanced /></Layout>} />
      <Route path="/bot-control" element={<Layout><BotControl /></Layout>} />
      <Route path="/api-vault" element={<Layout><ApiVault /></Layout>} />
      <Route path="/settings" element={<Layout><Settings /></Layout>} />
      <Route path="/security" element={<Layout><Security /></Layout>} />
      <Route path="/help" element={<Layout><Help /></Layout>} />
      <Route path="/bots" element={<Layout><Bots /></Layout>} />
      <Route path="/change-approval" element={<Layout><ChangeApproval /></Layout>} />
      <Route path="/portfolio" element={<Layout><Portfolio /></Layout>} />
      <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </RouterRoutes>
  );
}
