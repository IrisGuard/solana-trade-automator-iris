
import { Routes as ReactRouterRoutes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard"; 
import Wallet from "@/pages/Wallet";
import Security from "@/pages/Security";
import Transactions from "@/pages/Transactions";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import NotFound from "@/pages/NotFound";
import ApiVault from "@/pages/ApiVault";
import Bots from "@/pages/Bots";

console.log("Routes module loaded");

export function Routes() {
  console.log("Routes component rendering");
  return (
    <ReactRouterRoutes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
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
