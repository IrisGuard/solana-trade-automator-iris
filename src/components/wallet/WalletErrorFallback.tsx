
import React, { useEffect } from "react";
import { Routes } from "@/routes";
import { Toaster } from "@/components/ui/toaster";
import { SolanaProviderFallback } from "@/components/wallet/SolanaProviderFallback";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useErrorReporting } from "@/hooks/useErrorReporting";
import { isPhantomInstalled } from "@/utils/phantomWallet";

export function WalletErrorFallback({ error }: { error?: Error }) {
  const { reportError } = useErrorReporting();
  const phantomInstalled = isPhantomInstalled();
  
  useEffect(() => {
    // Αναφορά του σφάλματος όταν εμφανίζεται το fallback
    if (error) {
      reportError(error, {
        component: "WalletErrorFallback",
        details: { operation: "fallback" },
        source: "client"
      });
      
      console.error("Wallet provider error:", error);
    }
    
    // Έλεγχος για το Phantom Wallet
    if (!phantomInstalled) {
      toast.error("Το Phantom Wallet δεν είναι εγκατεστημένο", {
        description: "Ορισμένες λειτουργίες της εφαρμογής δεν θα είναι διαθέσιμες",
        duration: 10000,
        action: {
          label: "Εγκατάσταση",
          onClick: () => window.open("https://phantom.app", "_blank")
        }
      });
    }
  }, [error, reportError, phantomInstalled]);
  
  const handleRefresh = () => {
    window.location.href = "/"; // Ανακατεύθυνση στην αρχική σελίδα
  };

  return (
    <SolanaProviderFallback>
      <div className="relative">
        {error && (
          <Alert variant="destructive" className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-lg w-full shadow-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Πρόβλημα φόρτωσης του Solana wallet provider</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-2">
                {error.message || "Δεν ήταν δυνατή η σύνδεση στο Solana wallet provider."}
              </p>
              <div className="flex gap-2 mt-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Επαναφόρτωση
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        <Routes />
        <Toaster />
      </div>
    </SolanaProviderFallback>
  );
}
