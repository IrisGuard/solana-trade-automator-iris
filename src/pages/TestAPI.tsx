
import React, { useEffect, useState } from "react";
import { TestApp } from "@/components/TestApp";
import { PageHeader } from "@/components/layout/PageHeader";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { ConsoleMonitor } from "@/components/debug/ConsoleMonitor";
import { Button } from "@/components/ui/button";
import { initializeSystemApiKeys } from "@/utils/apiKeyInitializer";

export default function TestAPI() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Add comprehensive logging
  useEffect(() => {
    console.log("[Debug] TestAPI page mounting...");
    
    try {
      console.log("[Debug] Starting loading timer...");
      // Simulate a short loading time to ensure components are ready
      const timer = setTimeout(() => {
        console.log("[Debug] Timer completed, setting isLoading=false");
        setIsLoading(false);
        console.log("[Debug] TestAPI page loaded successfully");
        toast.success("Η σελίδα API Testing φορτώθηκε επιτυχώς", { 
          id: "test-api-load-success" 
        });
      }, 1500); // Slight increase to ensure components have time to mount
      
      return () => {
        clearTimeout(timer);
        console.log("[Debug] TestAPI page unmounted, timer cleared");
      };
    } catch (err) {
      console.error("[Error] Error in TestAPI page load effect:", err);
      setError("Προέκυψε σφάλμα κατά τη φόρτωση της σελίδας. Παρακαλώ ανανεώστε τη σελίδα.");
      setIsLoading(false);
      
      // Log the error with more details
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error("Σφάλμα φόρτωσης", {
        description: errorMessage,
        id: "test-api-load-error"
      });
    }
  }, []);

  // Handle API key initialization
  const handleInitializeKeys = async () => {
    setIsInitializing(true);
    try {
      const result = await initializeSystemApiKeys();
      if (result) {
        toast.success("API Keys αρχικοποιήθηκαν επιτυχώς");
      } else {
        toast.warning("Δεν ήταν δυνατή η πλήρης αρχικοποίηση των API Keys");
      }
    } catch (err) {
      console.error("Σφάλμα αρχικοποίησης API Keys:", err);
      toast.error("Σφάλμα αρχικοποίησης API Keys");
    } finally {
      setIsInitializing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary mb-4" />
          <h2 className="text-xl font-medium mb-2">Φόρτωση σελίδας API Testing</h2>
          <p className="text-muted-foreground">Παρακαλώ περιμένετε...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-4">
        <PageHeader
          title="API Testing"
          description="Test various API integration methods"
        />
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex gap-2">
          <Button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Ανανέωση σελίδας
          </Button>
          <Button
            onClick={handleInitializeKeys}
            disabled={isInitializing}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isInitializing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Αρχικοποίηση API Keys
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConsoleMonitor />
      <div className="space-y-6">
        <PageHeader
          title="API Testing"
          description="Test various API integration methods"
        />
        <div className="flex justify-end mb-4">
          <Button
            onClick={handleInitializeKeys}
            disabled={isInitializing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {isInitializing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Αρχικοποίηση API Keys
          </Button>
        </div>
        <TestApp />
      </div>
    </>
  );
}
