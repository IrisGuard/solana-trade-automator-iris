
import { Routes as ReactRouterRoutes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard"; 
import Wallet from "@/pages/Wallet";
import Security from "@/pages/Security";
import Transactions from "@/pages/Transactions";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import NotFound from "@/pages/NotFound";
import ApiVault from "@/pages/ApiVault";
import Bots from "@/pages/Bots";
import Index from "@/pages/Index";
import Home from "@/pages/Home";

export function Routes() {
  return (
    <ReactRouterRoutes>
      <Route path="/" element={<Index />} />
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/security" element={<Security />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        <Route path="/api-vault" element={<ApiVault />} />
        <Route path="/bots" element={<Bots />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </ReactRouterRoutes>
  );
}
