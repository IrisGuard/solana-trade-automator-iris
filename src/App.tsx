
import React from "react";
import { SupabaseAuthProvider } from "./providers/SupabaseAuthProvider";
import { Routes } from "./routes";

function App() {
  return (
    <SupabaseAuthProvider>
      <div className="app-container min-h-screen">
        <Routes />
      </div>
    </SupabaseAuthProvider>
  );
}

export default App;
