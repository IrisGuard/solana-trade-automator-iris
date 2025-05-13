
import React from "react";
import { SupabaseAuthProvider } from "./providers/SupabaseAuthProvider";
import { Routes } from "./routes";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <SupabaseAuthProvider>
      <div className="app-container min-h-screen">
        <Routes />
        <Toaster />
      </div>
    </SupabaseAuthProvider>
  );
}

export default App;
