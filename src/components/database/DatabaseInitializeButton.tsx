
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Database } from "lucide-react";
import { initializeDatabase, syncHeliusKeys } from "@/utils/databaseInitializer";
import { toast } from "sonner";
import { useAuth } from "@/providers/SupabaseAuthProvider";

export function DatabaseInitializeButton() {
  const [isInitializing, setIsInitializing] = useState(false);
  const { user } = useAuth();

  const handleInitialize = async () => {
    if (!user) {
      toast.error("Παρακαλώ συνδεθείτε πρώτα");
      return;
    }
    
    setIsInitializing(true);
    try {
      // Αρχικοποίηση της βάσης δεδομένων
      const success = await initializeDatabase();
      
      if (success) {
        // Συγχρονισμός των κλειδιών Helius
        await syncHeliusKeys();
        
        toast.success("Η βάση δεδομένων αρχικοποιήθηκε επιτυχώς!");
        
        // Ανανέωση της σελίδας για φόρτωση των νέων δεδομένων
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Υπήρξε πρόβλημα κατά την αρχικοποίηση της βάσης δεδομένων");
      }
    } catch (error) {
      console.error("Σφάλμα κατά την αρχικοποίηση:", error);
      toast.error("Σφάλμα κατά την αρχικοποίηση");
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <Button
      variant="default"
      onClick={handleInitialize}
      disabled={isInitializing || !user}
      className="gap-2"
    >
      {isInitializing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Database className="h-4 w-4" />
      )}
      {isInitializing ? "Αρχικοποίηση..." : "Αρχικοποίηση Δεδομένων"}
    </Button>
  );
}
