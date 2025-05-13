
import React from "react";
import { SupabaseAuthProvider } from "./providers/SupabaseAuthProvider";
import { Routes } from "./routes";
import { Toaster } from "sonner"; 

function App() {
  console.log("App component mounted");

  return (
    <SupabaseAuthProvider>
      <div className="app-container">
        <Routes />
        <Toaster position="top-right" richColors closeButton />
      </div>
    </SupabaseAuthProvider>
  );
}

export default App;
