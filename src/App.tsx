
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { Layout } from "./components/layout/Layout";
import Security from "./pages/Security";
import Wallet from "./pages/Wallet";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/security" element={<Security />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
