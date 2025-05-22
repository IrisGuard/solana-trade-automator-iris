
import React from "react";
import { Button } from "@/components/ui/button";
import { Lock, Upload, Download, ShieldAlert, Server, RefreshCw } from "lucide-react";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { useSupabaseSync } from "../hooks/useSupabaseSync";
import { ApiKey } from "../types";

interface ApiVaultActionsProps {
  onImportClick: () => void;
  onExportClick: () => void;
  onLockClick: () => void;
  onSecurityClick: () => void;
  isLocked: boolean;
  apiKeys: ApiKey[];
  setApiKeys?: React.Dispatch<React.SetStateAction<ApiKey[]>>;
  // Add the missing props from the error
  isRecovering?: boolean;
  isTestingKeys?: boolean;
  handleRecoverClick?: () => void;
}

export function ApiVaultActions({
  onImportClick,
  onExportClick,
  onLockClick,
  onSecurityClick,
  isLocked,
  apiKeys,
  setApiKeys,
  isRecovering = false,
  isTestingKeys = false,
  handleRecoverClick
}: ApiVaultActionsProps) {
  const { user } = useAuth();
  const { syncApiKeysToSupabase, isSyncing } = useSupabaseSync();
  
  const handleSyncToSupabase = async () => {
    if (!setApiKeys) return;
    
    const syncedKeys = await syncApiKeysToSupabase(apiKeys);
    if (syncedKeys.length > 0) {
      // Only update if we got keys back
      setApiKeys(syncedKeys);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onImportClick}
        disabled={isLocked}
      >
        <Upload className="h-4 w-4 mr-2" />
        Εισαγωγή
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onExportClick}
        disabled={isLocked || apiKeys.length === 0}
      >
        <Download className="h-4 w-4 mr-2" />
        Εξαγωγή
      </Button>
      
      <Button
        variant={isLocked ? "default" : "outline"}
        size="sm"
        onClick={onLockClick}
      >
        <Lock className="h-4 w-4 mr-2" />
        {isLocked ? "Ξεκλείδωμα" : "Κλείδωμα"}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onSecurityClick}
      >
        <ShieldAlert className="h-4 w-4 mr-2" />
        Ασφάλεια
      </Button>

      {user && setApiKeys && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleSyncToSupabase}
          disabled={isSyncing || isLocked || apiKeys.length === 0}
        >
          <Server className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-pulse' : ''}`} />
          {isSyncing ? 'Συγχρονισμός...' : 'Αποθήκευση στο Supabase'}
        </Button>
      )}

      {handleRecoverClick && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRecoverClick}
          disabled={isRecovering || isTestingKeys}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRecovering ? 'animate-spin' : ''}`} />
          {isRecovering ? 'Σάρωση...' : 'Ανάκτηση Κλειδιών'}
        </Button>
      )}
    </div>
  );
}
