
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import BotControl from "./pages/BotControl";
import Tokens from "./pages/Tokens";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Wallet from "./pages/Wallet";
import Security from "./pages/Security";
import Notifications from "./pages/Notifications";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import { SupabaseAuthProvider } from "./providers/SupabaseAuthProvider";
import { SolanaWalletProvider } from "./providers/SolanaWalletProvider";

const queryClient = new QueryClient();

// Main app component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <SolanaWalletProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Index />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="bot-control" element={<BotControl />} />
                  <Route path="tokens" element={<Tokens />} />
                  <Route path="wallet" element={<Wallet />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="security" element={<Security />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </TooltipProvider>
        </SolanaWalletProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
