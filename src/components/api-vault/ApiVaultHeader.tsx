
import React from "react";

interface ApiVaultHeaderProps {
  isLoggedIn?: boolean;
}

export function ApiVaultHeader({ isLoggedIn }: ApiVaultHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">API Κλειδιά</h2>
        <p className="text-muted-foreground">
          Διαχειριστείτε με ασφάλεια τα API κλειδιά των υπηρεσιών σας
        </p>
      </div>
    </div>
  );
}
