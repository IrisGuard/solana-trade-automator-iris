
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
      <Routes>
        <Route 
          path="/" 
          element={
            <Layout>
              <Index />
            </Layout>
          } 
        />
        <Route 
          path="/wallet" 
          element={
            <Layout>
              <Wallet />
            </Layout>
          } 
        />
        <Route 
          path="/security" 
          element={
            <Layout>
              <Security />
            </Layout>
          } 
        />
        <Route 
          path="/key-recovery" 
          element={
            <Layout>
              <KeyRecoveryPage />
            </Layout>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
