
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { addHeliusEndpoints, addHeliusKey } from "@/utils/addHeliusEndpoints";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function AddHeliusButton() {
  const [isAdding, setIsAdding] = React.useState(false);
  const [isAdded, setIsAdded] = React.useState(false);
  const { user } = useAuth();

  // Έλεγχος αν το κλειδί Helius έχει ήδη προστεθεί
  React.useEffect(() => {
    const checkHeliusKey = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('api_keys_storage')
          .select('*')
          .eq('service', 'helius')
          .eq('user_id', user.id);
          
        if (!error && data && data.length > 0) {
          setIsAdded(true);
        }
      } catch (error) {
        console.error("Error checking for Helius key:", error);
      }
    };
    
    checkHeliusKey();
  }, [user]);

  const handleAddHelius = async () => {
    if (!user) {
      toast.error("Πρέπει να συνδεθείτε για να προσθέσετε το Helius");
      return;
    }

    setIsAdding(true);
    try {
      // Προσθήκη των endpoints
      await addHeliusEndpoints();
      
      // Προσθήκη του κλειδιού στην κλειδοθήκη
      const result = await addHeliusKey(user.id);
      
      if (result) {
        setIsAdded(true);
        toast.success("Όλα τα κλειδιά και τα endpoints του Helius προστέθηκαν επιτυχώς!");
      }
    } catch (error) {
      console.error("Error adding Helius integration:", error);
      toast.error("Σφάλμα κατά την προσθήκη του Helius");
    } finally {
      setIsAdding(false);
    }
  };

  if (isAdded) {
    return (
      <Button variant="outline" className="gap-2 bg-green-50 text-green-700 border-green-200" disabled>
        <Check size={16} />
        Το Helius προστέθηκε επιτυχώς
      </Button>
    );
  }

  return (
    <Button
      variant={isAdding ? "outline" : "default"}
      onClick={handleAddHelius}
      disabled={isAdding || !user}
      className="gap-2"
    >
      {isAdding ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <AlertCircle size={16} />
      )}
      {isAdding ? "Προσθήκη σε εξέλιξη..." : "Προσθήκη κλειδιών Helius"}
    </Button>
  );
}
