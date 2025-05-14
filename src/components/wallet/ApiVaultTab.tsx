
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ApiVaultTab() {
  return (
    <TabsContent value="api-vault" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>API Vault</CardTitle>
          <CardDescription>
            Ασφαλής αποθήκευση και διαχείριση των API keys σας
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Το API Vault είναι υπό κατασκευή.</p>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
