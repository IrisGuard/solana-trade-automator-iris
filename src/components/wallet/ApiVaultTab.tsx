
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Key, Lock, AlertCircle } from "lucide-react";

interface ApiVaultTabProps {
  apiKeys: any[] | undefined;
  handleApiConnect: () => void;
}

export function ApiVaultTab({ apiKeys = [], handleApiConnect }: ApiVaultTabProps) {
  return (
    <TabsContent value="api-vault">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Vault
          </CardTitle>
          <CardDescription>
            Αποθηκεύστε με ασφάλεια και διαχειριστείτε τα API keys σας
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {Array.isArray(apiKeys) && apiKeys.length > 0 ? (
            <div className="space-y-4">
              {apiKeys.map((key, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{key.service || "Unknown Service"}</p>
                    <p className="text-sm text-muted-foreground">
                      {key.description || "No description"}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Δεν έχετε αποθηκευμένα API keys</h3>
              <p className="text-muted-foreground mb-4">
                Αποθηκεύστε με ασφάλεια τα API keys σας για Solana και άλλες υπηρεσίες
              </p>
              <Button onClick={handleApiConnect}>
                Connect API
              </Button>
            </div>
          )}
          
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Προσοχή</AlertTitle>
            <AlertDescription>
              Τα API keys κρυπτογραφούνται στον browser σας. Συνιστούμε να κάνετε τακτικό backup.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
