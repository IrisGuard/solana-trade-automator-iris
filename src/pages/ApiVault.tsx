
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiVaultHeader } from "@/components/api-vault/ApiVaultHeader";
import { ApiVaultInfoAlert } from "@/components/api-vault/ApiVaultInfoAlert";
import { ManageTabContent } from "@/components/api-vault/ManageTabContent";
import { ExportTabContent } from "@/components/api-vault/ExportTabContent";
import { ImportTabContent } from "@/components/api-vault/ImportTabContent";
import { LoginRequiredCard } from "@/components/api-vault/LoginRequiredCard";
import { useAuth } from "@/providers/AuthProvider";

export default function ApiVault() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("manage");
  
  // Handle login click
  const handleLoginClick = () => {
    window.location.href = "/auth";
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <ApiVaultHeader />
        <div className="flex items-center justify-center p-12 bg-background rounded-lg border">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Φόρτωση...</span>
        </div>
      </div>
    );
  }

  // If user is not logged in, show login required card
  if (!user) {
    return (
      <div className="space-y-6">
        <ApiVaultHeader />
        <LoginRequiredCard onLogin={handleLoginClick} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ApiVaultHeader isLoggedIn={!!user} />
      <ApiVaultInfoAlert />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manage">Διαχείριση</TabsTrigger>
          <TabsTrigger value="export">Εξαγωγή</TabsTrigger>
          <TabsTrigger value="import">Εισαγωγή</TabsTrigger>
        </TabsList>

        <TabsContent value="manage">
          <ManageTabContent userId={user.id} />
        </TabsContent>

        <TabsContent value="export">
          <ExportTabContent userId={user.id} />
        </TabsContent>

        <TabsContent value="import">
          <ImportTabContent userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
