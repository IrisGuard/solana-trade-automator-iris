
import React, { useEffect, useState } from "react";
import { ApiVaultCard } from "@/components/security/apiVault/ApiVaultCard";
import { ApiEndpointsCard } from "@/components/security/ApiEndpointsCard";
import { ApiEndpointsManager } from "@/components/security/endpoints/ApiEndpointsManager";
import { AddHeliusButton } from "@/components/security/apiVault/AddHeliusButton";
import { RegisterHeliusKeysButton } from "@/components/security/apiVault/RegisterHeliusKeysButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { SupabaseApiKeysList } from "@/components/security/SupabaseApiKeysList";
import { Button } from "@/components/ui/button";
import { RefreshCw, Key, Loader2 } from "lucide-react";
import { HeliusService } from "@/services/helius/HeliusService"; 
import { ApiKeyCheckButton } from "@/components/security/ApiKeyCheckButton";
import { HeliusSyncButton } from "@/components/HeliusSyncButton";
import { HeliusStatusMonitor } from "@/components/HeliusStatusMonitor";

export default function ApiVault() {
  const [keyCount, setKeyCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Φόρτωση πληροφοριών Helius
  useEffect(() => {
    const loadHeliusInfo = async () => {
      setIsLoading(true);
      try {
        const status = await HeliusService.checkStatus();
        setKeyCount(status.keyCount);
      } catch (error) {
        console.error("Error loading API keys:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHeliusInfo();
  }, []);

  // Ανανέωση της διαμόρφωσης Helius
  const handleRefreshHelius = async () => {
    setIsLoading(true);
    try {
      await HeliusService.refreshConfiguration();
      const status = await HeliusService.checkStatus();
      setKeyCount(status.keyCount);
    } catch (error) {
      console.error("Error refreshing API keys:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Κλειδοθήκη API</h2>
          <p className="text-muted-foreground">
            Διαχείριση των κλειδιών API και των συνδέσεων σας με ασφάλεια
          </p>
        </div>
        <div className="flex gap-2">
          <ApiKeyCheckButton />
          <Button 
            variant="outline"
            onClick={handleRefreshHelius}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Ανανέωση
          </Button>
          <AddHeliusButton />
          <RegisterHeliusKeysButton />
        </div>
      </div>
      
      {/* Προσθήκη του HeliusStatusMonitor */}
      <HeliusStatusMonitor />
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" /> Στατιστικά Κλειδιών
          </CardTitle>
          <CardDescription>
            Διαθέσιμα κλειδιά API και τρέχουσα κατάσταση
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium text-muted-foreground mb-1">Κλειδιά Helius</div>
              <div className="text-2xl font-bold">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : keyCount}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium text-muted-foreground mb-1">Ενεργά Endpoints</div>
              <div className="text-2xl font-bold">5</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium text-muted-foreground mb-1">Κατάσταση</div>
              <div className="text-lg font-medium flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${keyCount > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                {keyCount > 0 ? 'Συνδεδεμένο' : 'Περιορισμένο'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <SupabaseApiKeysList />
        <ApiVaultCard />
        <ApiEndpointsManager />
        <ApiEndpointsCard />
      </div>
    </div>
  );
}
