
import React from "react";
import { SolanaWalletProvider } from "./providers/SolanaWalletProvider";
import { SupabaseAuthProvider } from "./providers/SupabaseAuthProvider";
import { Routes } from "./routes";
import { Toaster } from "sonner";

function App() {
  return (
    <SolanaWalletProvider>
      <SupabaseAuthProvider>
        <Routes />
        <Toaster position="top-right" richColors closeButton />
      </SupabaseAuthProvider>
    </SolanaWalletProvider>
  );
}

export default App;
