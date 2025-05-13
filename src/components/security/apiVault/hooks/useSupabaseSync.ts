
import { useState } from "react";
import { ApiKey } from "../types";
import { ApiIntegrationService } from "../ApiIntegrationService";
import { toast } from "sonner";
import { useAuth } from "@/providers/SupabaseAuthProvider";

export function useSupabaseSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { user } = useAuth();

  const syncApiKeysToSupabase = async (apiKeys: ApiKey[]) => {
    if (!user) {
      toast.error("Πρέπει να συνδεθείτε για να συγχρονίσετε τα κλειδιά σας");
      return [];
    }

    setIsSyncing(true);
    try {
      const syncCount = await ApiIntegrationService.syncKeysWithSupabase(apiKeys, user.id);
      
      if (syncCount > 0) {
        toast.success(`Συγχρονίστηκαν ${syncCount} κλειδιά με το Supabase`);
      } else {
        toast.info("Όλα τα κλειδιά είναι ήδη συγχρονισμένα");
      }
      
      return await ApiIntegrationService.fetchKeysFromSupabase(user.id);
    } catch (error) {
      console.error("Error syncing with Supabase:", error);
      toast.error("Σφάλμα κατά τον συγχρονισμό με το Supabase");
      return [];
    } finally {
      setIsSyncing(false);
    }
  };

  const fetchApiKeysFromSupabase = async () => {
    if (!user) {
      return [];
    }

    setIsSyncing(true);
    try {
      const keys = await ApiIntegrationService.fetchKeysFromSupabase(user.id);
      return keys;
    } catch (error) {
      console.error("Error fetching from Supabase:", error);
      return [];
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    syncApiKeysToSupabase,
    fetchApiKeysFromSupabase,
    isSyncing,
    isAuthenticated: !!user
  };
}
