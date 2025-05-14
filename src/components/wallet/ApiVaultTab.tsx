
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface ApiKeyProps {
  apiKeys?: any[];
  handleApiConnect?: (index: number) => void;
}

export function ApiVaultTab({ apiKeys = [], handleApiConnect = () => {} }: ApiKeyProps) {
  return (
    <TabsContent value="api-vault">
      <Card>
        <CardHeader>
          <CardTitle>API Vault</CardTitle>
          <CardDescription>
            Ασφαλής αποθήκευση και διαχείριση των κλειδιών API σας
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-muted/50 rounded-full p-6 mb-4">
              <Lock className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Το API Vault είναι κλειδωμένο</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Για να αποκτήσετε πρόσβαση στα κλειδιά API σας και στις ρυθμίσεις ασφαλείας, παρακαλώ ξεκλειδώστε το API Vault.
            </p>
            <Button>Ξεκλείδωμα API Vault</Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
