
import React from "react";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw, KeyRound, PlusCircle, CloudUpload, Server } from "lucide-react";
import { injectDemoKeys } from "../utils";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ApiKey } from "../types";

interface ApiVaultActionsProps {
  isLocked: boolean;
  apiKeys: ApiKey[];
  isRecovering: boolean;
  isTestingKeys: boolean;
  handleRecoverClick: () => void;
  setApiKeys?: React.Dispatch<React.SetStateAction<ApiKey[]>>;
}

export const ApiVaultActions: React.FC<ApiVaultActionsProps> = ({
  isLocked,
  apiKeys,
  isRecovering,
  isTestingKeys,
  handleRecoverClick,
  setApiKeys
}) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Συνάρτηση για αποθήκευση κλειδιών στο Supabase
  const uploadKeysToSupabase = async () => {
    if (!user) {
      toast.error("Πρέπει να συνδεθείτε για να αποθηκεύσετε τα κλειδιά σας στο Supabase");
      return;
    }

    if (apiKeys.length === 0) {
      toast.warning("Δεν υπάρχουν κλειδιά για αποθήκευση");
      return;
    }

    setIsUploading(true);
    try {
      let successCount = 0;
      let errorCount = 0;

      // Επεξεργασία κάθε κλειδιού
      for (const key of apiKeys) {
        const { data, error } = await supabase
          .from('api_keys_storage')
          .upsert({
            user_id: user.id,
            name: key.name,
            service: key.service,
            key_value: key.key,
            description: key.description || null,
            status: key.status || 'active',
            is_encrypted: false, // Μελλοντική υποστήριξη κρυπτογράφησης
            updated_at: new Date().toISOString()
          })
          .select();

        if (error) {
          console.error("Σφάλμα κατά την αποθήκευση κλειδιού:", error);
          errorCount++;
        } else {
          successCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Αποθηκεύτηκαν επιτυχώς ${successCount} κλειδιά στο Supabase`);
      }
      if (errorCount > 0) {
        toast.error(`Αποτυχία αποθήκευσης ${errorCount} κλειδιών`);
      }
    } catch (error) {
      console.error("Σφάλμα κατά την αποθήκευση των κλειδιών:", error);
      toast.error("Σφάλμα κατά την αποθήκευση των κλειδιών στο Supabase");
    } finally {
      setIsUploading(false);
    }
  };

  // Συνάρτηση για ανάκτηση κλειδιών από το Supabase
  const syncKeysFromSupabase = async () => {
    if (!user) {
      toast.error("Πρέπει να συνδεθείτε για να ανακτήσετε τα κλειδιά σας από το Supabase");
      return;
    }

    if (!setApiKeys) {
      toast.error("Σφάλμα: Δεν μπορεί να γίνει ο συγχρονισμός των κλειδιών");
      return;
    }

    setIsSyncing(true);
    try {
      // Ανάκτηση κλειδιών από το Supabase
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        toast.info("Δεν βρέθηκαν αποθηκευμένα κλειδιά στο Supabase");
        setIsSyncing(false);
        return;
      }

      // Μετατροπή των δεδομένων σε μορφή ApiKey
      const supabaseKeys: ApiKey[] = data.map(item => ({
        id: item.id,
        name: item.name,
        service: item.service,
        key: item.key_value,
        createdAt: item.created_at,
        status: item.status as 'active' | 'expired' | 'revoked',
        description: item.description
      }));

      // Συνδυασμός τοπικών και απομακρυσμένων κλειδιών (χωρίς διπλότυπα)
      setApiKeys(prevKeys => {
        const existingKeyIds = new Set(prevKeys.map(k => k.id));
        const newKeys = supabaseKeys.filter(k => !existingKeyIds.has(k.id));
        
        if (newKeys.length > 0) {
          toast.success(`Προστέθηκαν ${newKeys.length} νέα κλειδιά από το Supabase`);
          return [...prevKeys, ...newKeys];
        } else {
          toast.info("Όλα τα κλειδιά από το Supabase υπάρχουν ήδη τοπικά");
          return prevKeys;
        }
      });
    } catch (error) {
      console.error("Σφάλμα κατά την ανάκτηση των κλειδιών:", error);
      toast.error("Σφάλμα κατά την ανάκτηση των κλειδιών από το Supabase");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {!isLocked && (
        <>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRecoverClick}
            disabled={isRecovering}
            className="flex items-center gap-1"
          >
            <Database className={`h-4 w-4 ${isRecovering ? 'animate-pulse' : ''}`} />
            <span>Ανάκτηση κλειδιών</span>
          </Button>
          
          {apiKeys.length < 20 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => injectDemoKeys()}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Επαναφορά κλειδιών χρήστη</span>
            </Button>
          )}

          {user && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={uploadKeysToSupabase}
                disabled={isUploading}
                className="flex items-center gap-1"
              >
                <CloudUpload className={`h-4 w-4 ${isUploading ? 'animate-pulse' : ''}`} />
                <span>{isUploading ? 'Αποθήκευση...' : 'Αποθήκευση στο Supabase'}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={syncKeysFromSupabase}
                disabled={isSyncing}
                className="flex items-center gap-1"
              >
                <Server className={`h-4 w-4 ${isSyncing ? 'animate-pulse' : ''}`} />
                <span>{isSyncing ? 'Συγχρονισμός...' : 'Συγχρονισμός από Supabase'}</span>
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
};
