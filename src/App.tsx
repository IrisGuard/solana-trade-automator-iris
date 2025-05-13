
import React, { useEffect } from "react";
import { SolanaWalletProvider } from "./providers/SolanaWalletProvider";
import { SupabaseAuthProvider } from "./providers/SupabaseAuthProvider";
import { Routes } from "./routes";
import { Toaster } from "sonner"; // Άμεση χρήση του Toaster από το sonner

function App() {
  useEffect(() => {
    console.log("App component mounted successfully!");
    
    // Έλεγχος αν το DOM έχει φορτωθεί πλήρως
    if (document.readyState === 'complete') {
      console.log("Document fully loaded");
    } else {
      window.addEventListener('load', () => {
        console.log("Window load event triggered");
      });
    }
  }, []);

  return (
    <SolanaWalletProvider>
      <SupabaseAuthProvider>
        <div className="app-container">
          <Routes />
          <Toaster position="top-right" richColors closeButton />
        </div>
      </SupabaseAuthProvider>
    </SolanaWalletProvider>
  );
}

export default App;
