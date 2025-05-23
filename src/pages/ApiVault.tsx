
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Key, Lock } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppNavigation } from "@/components/navigation/AppNavigation";
import { GradientCard } from "@/components/ui/gradient-card";
import { useUser } from "@/hooks/useUser";

export default function ApiVaultPage() {
  const { user, loading } = useUser();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="API Vault"
        description="Ασφαλής διαχείριση API κλειδιών και πιστοποιητικών"
        breadcrumbs={[{ label: "API Vault" }]}
        variant="amber"
      />
      
      <div className="mb-6">
        <AppNavigation variant="colorful" />
      </div>

      <div className="grid gap-6">
        <GradientCard 
          variant="amber"
          header={
            <>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Ασφαλής Αποθήκευση
              </CardTitle>
              <CardDescription>
                Διαχειριστείτε τα API κλειδιά σας με ασφάλεια
              </CardDescription>
            </>
          }
        >
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Φόρτωση...</p>
            </div>
          ) : !user ? (
            <div className="text-center py-8">
              <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Συνδεθείτε για να διαχειριστείτε τα API κλειδιά σας</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Δεν βρέθηκαν αποθηκευμένα API κλειδιά</p>
            </div>
          )}
        </GradientCard>
      </div>
    </div>
  );
}
