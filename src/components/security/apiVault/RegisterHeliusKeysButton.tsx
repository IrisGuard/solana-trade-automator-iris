
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Database, Check } from "lucide-react";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { toast } from "sonner";
import { registerHeliusApiKeys, registerHeliusEndpoints } from "@/utils/addHeliusApiKeys";
import { heliusKeyManager } from "@/services/solana/HeliusKeyManager";
import { importHeliusKeysFromSqlSchema } from "@/utils/importHeliusKeys";

export function RegisterHeliusKeysButton() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [keyCount, setKeyCount] = useState(0);
  const { user } = useAuth();

  React.useEffect(() => {
    // Check how many keys are already loaded
    const fetchKeyCount = async () => {
      await heliusKeyManager.initialize();
      setKeyCount(heliusKeyManager.getKeyCount());
      setIsComplete(heliusKeyManager.getKeyCount() >= 3);
    };
    
    fetchKeyCount();
  }, []);

  const handleRegisterKeys = async () => {
    if (!user) {
      toast.error("Πρέπει να συνδεθείτε για να προσθέσετε τα κλειδιά Helius");
      return;
    }

    setIsRegistering(true);
    try {
      // First try to import keys using the SQL schema format
      await importHeliusKeysFromSqlSchema(user.id);
      
      // Register the endpoints
      await registerHeliusEndpoints();
      
      // Register the API keys (this is a backup method)
      await registerHeliusApiKeys(user.id);
      
      // Refresh the key manager and update count
      await heliusKeyManager.initialize();
      setKeyCount(heliusKeyManager.getKeyCount());
      
      setIsComplete(true);
    } catch (error) {
      console.error("Error registering Helius API keys:", error);
      toast.error("Σφάλμα κατά την προσθήκη των κλειδιών");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Button
      variant={isComplete ? "outline" : "default"}
      onClick={handleRegisterKeys}
      disabled={isRegistering || !user || isComplete}
      className="gap-2"
    >
      {isRegistering ? (
        <Loader2 size={16} className="animate-spin" />
      ) : isComplete ? (
        <Check size={16} />
      ) : (
        <Database size={16} />
      )}
      {isComplete 
        ? `${keyCount} Helius Κλειδιά`
        : keyCount > 0 
          ? `Προσθήκη περισσότερων κλειδιών` 
          : "Προσθήκη όλων των κλειδιών Helius"}
    </Button>
  );
}
