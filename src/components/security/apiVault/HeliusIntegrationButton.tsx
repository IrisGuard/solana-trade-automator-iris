
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { addHeliusEndpoints, addHeliusKey } from "@/utils/addHeliusEndpoints";
import { toast } from "sonner";
import { useRouterNavigation } from "@/hooks/use-router";

export function HeliusIntegrationButton() {
  const [isAdding, setIsAdding] = React.useState(false);
  const [isAdded, setIsAdded] = React.useState(false);
  const { user } = useAuth();
  const { goTo } = useRouterNavigation();

  const handleAddHelius = async () => {
    if (!user) {
      toast.error("Πρέπει να συνδεθείτε για να προσθέσετε το Helius");
      return;
    }

    setIsAdding(true);
    try {
      // Προσθήκη των endpoints με placeholders για τα κλειδιά
      await addHeliusEndpoints();
      
      // Προσθήκη template κλειδιού στην κλειδοθήκη για να το συμπληρώσει ο χρήστης
      await addHeliusKey(user.id, "");
      
      setIsAdded(true);
      toast.success("Τα endpoints του Helius προστέθηκαν επιτυχώς! Προσθέστε το κλειδί API σας στην κλειδοθήκη.");
      
      // Προτροπή για προσθήκη πραγματικού κλειδιού
      toast.info("Μεταβείτε στο helius.xyz για να αποκτήσετε ένα πραγματικό κλειδί API", {
        duration: 5000,
        action: {
          label: "Επίσκεψη",
          onClick: () => window.open("https://dev.helius.xyz/dashboard/app", "_blank")
        }
      });
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
        Το Helius έχει προστεθεί
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
      {isAdding ? "Προσθήκη σε εξέλιξη..." : "Προσθήκη Helius"}
    </Button>
  );
}
