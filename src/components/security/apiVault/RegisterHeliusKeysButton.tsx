
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { toast } from "sonner";
import { registerHeliusApiKeys, registerHeliusEndpoints } from "@/utils/addHeliusApiKeys";
import { Loader2, Key } from "lucide-react";

export function RegisterHeliusKeysButton() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRegisterHeliusKeys = async () => {
    if (!user) {
      toast.error("Πρέπει να συνδεθείτε για να εγγράψετε τα κλειδιά Helius");
      return;
    }
    
    setIsLoading(true);
    try {
      // Εγγραφή των 6 κλειδιών API Helius
      const keysResult = await registerHeliusApiKeys(user.id);
      
      // Εγγραφή των endpoints
      const endpointsResult = await registerHeliusEndpoints();
      
      if (keysResult && endpointsResult) {
        toast.success("Τα κλειδιά Helius και τα endpoints καταχωρήθηκαν επιτυχώς!");
      } else if (keysResult) {
        toast.success("Τα κλειδιά Helius καταχωρήθηκαν επιτυχώς!");
      } else {
        toast.warning("Κάποιες εγγραφές δεν ολοκληρώθηκαν");
      }
    } catch (error) {
      console.error("Error registering Helius keys:", error);
      toast.error("Σφάλμα κατά την εγγραφή των κλειδιών Helius");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handleRegisterHeliusKeys}
      disabled={isLoading || !user}
      variant="default"
      size="sm"
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Key className="h-4 w-4" />
      )}
      Εγγραφή Helius
    </Button>
  );
}
