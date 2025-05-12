
import React from "react";
import { AccountAccessCard } from "@/components/security/AccountAccessCard";
import { TwoFactorCard } from "@/components/security/TwoFactorCard";
import { ApiVaultCard } from "@/components/security/apiVault/ApiVaultCard";
import { TransactionSecurityCard } from "@/components/security/TransactionSecurityCard";
import { SessionsCard } from "@/components/security/SessionsCard";

const Security = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Ασφάλεια</h2>
      </div>
      
      <ApiVaultCard />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AccountAccessCard />
        <TwoFactorCard />
      </div>
      
      <TransactionSecurityCard />
      <SessionsCard />
    </div>
  );
};

export default Security;
