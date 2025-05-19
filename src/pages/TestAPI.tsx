
import React, { useEffect, useState } from "react";
import { TestApp } from "@/components/TestApp";
import { PageHeader } from "@/components/layout/PageHeader";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function TestAPI() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Log that the page is being mounted
    console.log("TestAPI page is mounting");
    
    try {
      // Simulate a short loading time to ensure components are ready
      const timer = setTimeout(() => {
        setIsLoading(false);
        console.log("TestAPI page loaded successfully");
        toast.success("Η σελίδα API Testing φορτώθηκε επιτυχώς");
      }, 1000);
      
      return () => {
        clearTimeout(timer);
        console.log("TestAPI page unmounted");
      };
    } catch (err) {
      console.error("Error loading TestAPI page:", err);
      setError("Προέκυψε σφάλμα κατά τη φόρτωση της σελίδας. Παρακαλώ ανανεώστε τη σελίδα.");
      setIsLoading(false);
    }
  }, []);

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
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Ανανέωση σελίδας
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Testing"
        description="Test various API integration methods"
      />
      <TestApp />
    </div>
  );
}
