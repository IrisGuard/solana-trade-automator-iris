
import React from "react";
import { ApiVaultCard } from "@/components/security/apiVault/ApiVaultCard";
import { TwoFactorCard } from "@/components/security/TwoFactorCard";
import { AccountAccessCard } from "@/components/security/AccountAccessCard";
import { TransactionSecurityCard } from "@/components/security/TransactionSecurityCard";
import { SessionsCard } from "@/components/security/SessionsCard";
import { PlatformSecurityCard } from "@/components/security/PlatformSecurityCard";

export default function Security() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Ασφάλεια</h2>
        <p className="text-muted-foreground">
          Διαχειριστείτε τις ρυθμίσεις ασφαλείας και την προστασία του λογαριασμού σας
        </p>
      </div>
      
      {/* Νέα κάρτα ρυθμίσεων ασφαλείας πλατφόρμας */}
      <PlatformSecurityCard />
      
      {/* API Key Vault */}
      <ApiVaultCard />
      
      {/* Υπάρχουσες κάρτες ασφαλείας */}
      <div className="grid gap-6 md:grid-cols-2">
        <TwoFactorCard />
        <AccountAccessCard />
      </div>
      
      <TransactionSecurityCard />
      <SessionsCard />
    </div>
  );
}
