
import React from "react";
import { SolanaWalletProvider } from "./providers/SolanaWalletProvider";
import { SupabaseAuthProvider } from "./providers/SupabaseAuthProvider";
import { Routes } from "./routes";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <SolanaWalletProvider>
      <SupabaseAuthProvider>
        <Routes />
        <Toaster />
      </SupabaseAuthProvider>
    </SolanaWalletProvider>
  );
}

export default App;
