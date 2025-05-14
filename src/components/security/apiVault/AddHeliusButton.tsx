
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { toast } from "sonner";
import { importHeliusKeys } from "@/utils/importHeliusKeys";
import { Loader2 } from "lucide-react";

export function AddHeliusButton() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAddHeliusKeys = async () => {
    if (!user) {
      toast.error("Πρέπει να συνδεθείτε για να προσθέσετε τα κλειδιά Helius");
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await importHeliusKeys(user.id);
      if (result) {
        toast.success("Τα κλειδιά Helius προστέθηκαν επιτυχώς!");
      }
    } catch (error) {
      console.error("Error adding Helius keys:", error);
      toast.error("Σφάλμα κατά την προσθήκη των κλειδιών Helius");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handleAddHeliusKeys}
      disabled={isLoading || !user}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <span className="h-4 w-4 text-green-500">+</span>
      )}
      Προσθήκη Helius
    </Button>
  );
}
