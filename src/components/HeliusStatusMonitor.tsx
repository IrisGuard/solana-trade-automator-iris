
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { heliusService } from "@/services/helius/HeliusService";
import { RefreshCw, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeliusStatus {
  isOperational: boolean;
  keyCount: number;
  workingKeyCount: number;
  endpointCount: number;
  activeEndpointCount: number;
  lastCheck: Date | null;
}

export function HeliusStatusMonitor() {
  const [status, setStatus] = useState<HeliusStatus>({
    isOperational: false,
    keyCount: 0,
    workingKeyCount: 0,
    endpointCount: 0,
    activeEndpointCount: 0,
    lastCheck: null
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Έλεγχος κατάστασης κατά την αρχικοποίηση
  useEffect(() => {
    checkHeliusStatus();
    
    // Έλεγχος κάθε 5 λεπτά
    const interval = setInterval(checkHeliusStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Συνάρτηση για τον έλεγχο της κατάστασης
  const checkHeliusStatus = async () => {
    setIsLoading(true);
    try {
      // Διόρθωση για να χρησιμοποιήσει την getTokenBalances αντί της fetchTokenBalances
      const workingKeyCount = await heliusService.getTokenBalances("demo") ? 1 : 0;
      setStatus({
        isOperational: workingKeyCount > 0,
        keyCount: 1,
        workingKeyCount,
        endpointCount: 1,
        activeEndpointCount: 1,
        lastCheck: new Date()
      });
    } catch (error) {
      console.error("Error checking Helius status:", error);
      setStatus(prev => ({
        ...prev,
        isOperational: false,
        lastCheck: new Date()
      }));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Συνάρτηση για την ανανέωση της διαμόρφωσης
  const handleRefreshConfiguration = async () => {
    setIsLoading(true);
    try {
      await checkHeliusStatus();
    } catch (error) {
      console.error("Error refreshing Helius configuration:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <div className={`rounded-full h-3 w-3 ${status.isOperational ? 'bg-green-500' : 'bg-red-500'}`}></div>
          Κατάσταση Helius API
        </CardTitle>
        <CardDescription>
          {status.lastCheck 
            ? `Τελευταίος έλεγχος: ${status.lastCheck.toLocaleTimeString()}`
            : 'Έλεγχος κατάστασης...'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground mb-1">Κλειδιά API</div>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <span>{status.workingKeyCount}/{status.keyCount}</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Λειτουργικά/Σύνολο</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground mb-1">Endpoints</div>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <span>{status.activeEndpointCount}/{status.endpointCount}</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Ενεργά/Σύνολο</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground mb-1">Κατάσταση</div>
            <div className="text-lg font-medium flex items-center gap-2">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                status.isOperational ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Λειτουργικό</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span>Μη λειτουργικό</span>
                  </>
                )
              )}
            </div>
          </div>
          <div className="rounded-lg border p-3 flex items-center justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshConfiguration}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Έλεγχος & Ανανέωση
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
