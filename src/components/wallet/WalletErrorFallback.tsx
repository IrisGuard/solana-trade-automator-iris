
import React from "react";
import { Routes } from "@/routes";
import { Toaster } from "@/components/ui/toaster";
import { SolanaProviderFallback } from "@/components/wallet/SolanaProviderFallback";

export function WalletErrorFallback() {
  return (
    <SolanaProviderFallback>
      <Routes />
      <Toaster />
    </SolanaProviderFallback>
  );
}
