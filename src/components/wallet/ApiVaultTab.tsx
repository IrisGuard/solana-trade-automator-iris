
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ApiKey } from "./api-vault/types";
import { Badge } from "@/components/ui/badge";
import { Database, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApiVaultTabProps {
  apiKeys: ApiKey[];
  handleApiConnect: (index: number) => void;
}

export function ApiVaultTab({
  apiKeys,
  handleApiConnect,
}: ApiVaultTabProps) {
  
  return (
    <TabsContent value="api-vault" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>API Συνδέσεις</CardTitle>
          <CardDescription>Κατάσταση συνδέσεων με απαιτούμενα APIs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.length > 0 ? (
              <div className="space-y-3">
                {apiKeys.map((api, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                        api.connected ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'
                      }`}>
                        <Database className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{api.name}</p>
                        <div className="flex items-center gap-1">
                          {api.connected ? (
                            <>
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <p className="text-xs text-green-500">Συνδεδεμένο</p>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 text-red-500" />
                              <p className="text-xs text-red-500">Αποσυνδεδεμένο</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Badge variant={api.connected ? "outline" : "secondary"}>
                      {api.service}
                    </Badge>
                    
                    <Button 
                      variant={api.connected ? "outline" : "default"} 
                      size="sm"
                      onClick={() => handleApiConnect(index)}
                    >
                      {api.connected ? 'Αποσύνδεση' : 'Σύνδεση'}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Database className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-2 text-muted-foreground">Δεν υπάρχουν διαθέσιμες συνδέσεις API</p>
              </div>
            )}
            
            <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
              <p>Οι συνδέσεις API διαχειρίζονται από τον διαχειριστή της πλατφόρμας.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
