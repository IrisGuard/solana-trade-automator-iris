
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
        description="Secure management of API keys and credentials"
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
                Secure Storage
              </CardTitle>
              <CardDescription>
                Manage your API keys securely
              </CardDescription>
            </>
          }
        >
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
          ) : !user ? (
            <div className="text-center py-8">
              <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Connect to manage your API keys</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No stored API keys found</p>
            </div>
          )}
        </GradientCard>
      </div>
    </div>
  );
}
