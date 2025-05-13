
import React, { useEffect } from "react";
import { SolanaWalletProvider } from "./providers/SolanaWalletProvider";
import { SupabaseAuthProvider } from "./providers/SupabaseAuthProvider";
import { Routes } from "./routes";
import { Toaster } from "sonner";

function App() {
  useEffect(() => {
    console.log("App component mounted successfully!");
  }, []);

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
