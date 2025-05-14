
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function ApiVaultTab() {
  return (
    <TabsContent value="api-vault">
      <Card>
        <CardHeader>
          <CardTitle>API Vault</CardTitle>
          <CardDescription>
            Ασφαλής αποθήκευση και διαχείριση των API keys σας για trading
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border-2 border-dashed rounded-md text-center">
            <h3 className="text-lg font-medium mb-2">API Vault - Coming Soon</h3>
            <p className="text-sm text-muted-foreground">
              Αποθηκεύστε με ασφάλεια τα API keys σας για διάφορες υπηρεσίες.
              Αυτή η λειτουργία θα είναι σύντομα διαθέσιμη.
            </p>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
