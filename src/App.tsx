
import React, { useEffect } from "react";
import { SupabaseAuthProvider } from "./providers/SupabaseAuthProvider";
import { Routes } from "./routes";
import { Toaster } from "sonner"; 

function App() {
  useEffect(() => {
    console.log("App component mounted successfully!");
  }, []);

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
