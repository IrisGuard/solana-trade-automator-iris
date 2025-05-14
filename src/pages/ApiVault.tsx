
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupabaseApiKeysList } from "@/components/security/api-keys/SupabaseApiKeysList";
import { ApiKeysExporter } from "@/components/security/api-keys/ApiKeysExporter";
import { ApiKeysImporter } from "@/components/security/api-keys/ApiKeysImporter";

export default function ApiVault() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = React.useState("manage");

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight">API Κλειδιά</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Απαιτείται Σύνδεση</CardTitle>
            <CardDescription>
              Παρακαλώ συνδεθείτε για να διαχειριστείτε τα API κλειδιά σας
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Button>Σύνδεση</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">API Κλειδιά</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manage">Διαχείριση</TabsTrigger>
          <TabsTrigger value="export">Εξαγωγή</TabsTrigger>
          <TabsTrigger value="import">Εισαγωγή</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-4 mt-4">
          <SupabaseApiKeysList userId={user.id} />
        </TabsContent>

        <TabsContent value="export" className="space-y-4 mt-4">
          <ApiKeysExporter userId={user.id} />
        </TabsContent>

        <TabsContent value="import" className="space-y-4 mt-4">
          <ApiKeysImporter userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
