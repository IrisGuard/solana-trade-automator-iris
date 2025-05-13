
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Key, Plus, Upload, Database, Server } from "lucide-react";
import { injectDemoKeys } from "../utils";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ApiKey } from "../types";

interface EmptyApiVaultProps {
  onAddKeyClick: () => void;
  onImportClick?: () => void;
  setApiKeys?: React.Dispatch<React.SetStateAction<ApiKey[]>>;
}

export const EmptyApiVault: React.FC<EmptyApiVaultProps> = ({ 
  onAddKeyClick,
  onImportClick,
  setApiKeys
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSyncFromSupabase = async () => {
    if (!user) {
      toast.error("Πρέπει να συνδεθείτε για να συγχρονίσετε κλειδιά από το Supabase");
      return;
    }

    if (!setApiKeys) {
      toast.error("Σφάλμα: Δεν μπορεί να γίνει ο συγχρονισμός των κλειδιών");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        toast.info("Δεν βρέθηκαν κλειδιά αποθηκευμένα στο Supabase");
        return;
      }

      const supabaseKeys: ApiKey[] = data.map(item => ({
        id: item.id,
        name: item.name,
        service: item.service,
        key: item.key_value,
        createdAt: item.created_at,
        status: item.status as 'active' | 'expired' | 'revoked',
        description: item.description
      }));

      setApiKeys(supabaseKeys);
      toast.success(`Φορτώθηκαν ${supabaseKeys.length} κλειδιά από το Supabase`);
    } catch (error) {
      console.error("Σφάλμα κατά τη φόρτωση κλειδιών:", error);
      toast.error("Σφάλμα κατά τον συγχρονισμό από το Supabase");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
      <div className="p-4 bg-muted rounded-full">
        <Key className="h-12 w-12 text-muted-foreground opacity-70" />
      </div>
      <h3 className="text-xl font-medium">Δεν υπάρχουν κλειδιά API</h3>
      <p className="text-muted-foreground max-w-md">
        Προσθέστε τα κλειδιά API σας για πιο εύκολη διαχείριση και ασφαλή αποθήκευση.
        Όλα τα κλειδιά αποθηκεύονται τοπικά και κρυπτογραφημένα.
      </p>
      <div className="flex gap-3 mt-2 flex-wrap justify-center">
        <Button onClick={onAddKeyClick} className="gap-1">
          <Plus className="h-4 w-4" />
          Προσθήκη κλειδιού
        </Button>
        
        {onImportClick && (
          <Button variant="outline" onClick={onImportClick} className="gap-1">
            <Upload className="h-4 w-4" />
            Εισαγωγή κλειδιών
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          onClick={() => injectDemoKeys(0)}
          className="gap-1"
        >
          <Database className="h-4 w-4" />
          Επαναφορά κλειδιών
        </Button>

        {user && setApiKeys && (
          <Button
            variant="outline"
            onClick={handleSyncFromSupabase}
            disabled={isLoading}
            className="gap-1"
          >
            <Server className={`h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
            {isLoading ? 'Φόρτωση...' : 'Συγχρονισμός από Supabase'}
          </Button>
        )}
      </div>
    </div>
  );
};
