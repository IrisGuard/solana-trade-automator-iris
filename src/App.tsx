
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { Layout } from "./components/layout/Layout";
import Security from "./pages/Security";
import Wallet from "./pages/Wallet";
import BotControl from "./pages/BotControl";
import Dashboard from "./pages/Dashboard";
import Tokens from "./pages/Tokens";
import Transactions from "./pages/Transactions";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { SolanaWalletProvider } from "./providers/SolanaWalletProvider";
import { SupabaseAuthProvider } from "./providers/SupabaseAuthProvider";

function App() {
  return (
    <SolanaWalletProvider>
      <SupabaseAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/bot-control" element={<BotControl />} />
              <Route path="/tokens" element={<Tokens />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/security" element={<Security />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SupabaseAuthProvider>
    </SolanaWalletProvider>
  );
}

export default App;
