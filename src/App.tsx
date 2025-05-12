
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { Layout } from "./components/layout/Layout";
import Security from "./pages/Security";
import Wallet from "./pages/Wallet";
import KeyRecoveryPage from "./components/security/KeyRecoveryPage";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/security" element={<Security />} />
          <Route path="/key-recovery" element={<KeyRecoveryPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
