
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ApiVaultTab() {
  return (
    <TabsContent value="api-vault">
      <Card>
        <CardHeader>
          <CardTitle>API Vault</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            API Vault functionality will be implemented soon
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
