
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/useUser";
import { ApiVaultHeader } from "@/components/api-vault/ApiVaultHeader";
import { ApiVaultInfoAlert } from "@/components/api-vault/ApiVaultInfoAlert";
import { ManageTabContent } from "@/components/api-vault/ManageTabContent";
import { ExportTabContent } from "@/components/api-vault/ExportTabContent";
import { ImportTabContent } from "@/components/api-vault/ImportTabContent";
import { LoginRequiredCard } from "@/components/api-vault/LoginRequiredCard";

export default function ApiVault() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = React.useState("manage");

  // If user is not logged in, show login required card
  if (!user) {
    return (
      <div className="space-y-6">
        <ApiVaultHeader />
        <LoginRequiredCard onLogin={() => console.log("Login clicked")} />
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
