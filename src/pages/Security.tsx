
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
      
      {/* API Key Vault */}
      <div className="mt-4 mb-6">
        <h3 className="text-xl font-semibold mb-2">Κλειδοθήκη API</h3>
        <ApiVaultCard />
      </div>
      
      {/* Ρυθμίσεις ασφαλείας πλατφόρμας */}
      <PlatformSecurityCard />
      
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
