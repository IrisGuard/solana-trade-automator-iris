
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, Plus, Key, Settings, Lock, Unlock } from "lucide-react";
import { toast } from "sonner";

interface ApiVaultHeaderProps {
  onAddKey: () => void;
  onImport: () => void;
  onExport: () => void;
  apiKeysCount: number;
  onSettings?: () => void;
  isLocked?: boolean;
  isEncryptionEnabled?: boolean;
  onUnlock?: () => void;
  onLock?: () => void;
}

export const ApiVaultHeader: React.FC<ApiVaultHeaderProps> = ({
  onAddKey,
  onImport,
  onExport,
  apiKeysCount,
  onSettings,
  isLocked = false,
  isEncryptionEnabled = false,
  onUnlock,
  onLock
}) => {
  const handleExport = () => {
    if (apiKeysCount === 0) {
      toast.error("Δεν υπάρχουν κλειδιά για εξαγωγή");
      return;
    }
    onExport();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Key className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Κλειδιά API</h2>
      </div>
      <div className="flex gap-2">
        {isLocked ? (
          <Button 
            variant="outline" 
            onClick={onUnlock}
            className="gap-2"
          >
            <Unlock className="h-4 w-4" />
            Ξεκλείδωμα
          </Button>
        ) : (
          <>
            <Button 
              variant="outline" 
              onClick={onImport}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Εισαγωγή
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="gap-2" 
              disabled={apiKeysCount === 0}
            >
              <Download className="h-4 w-4" />
              Εξαγωγή
            </Button>
            {onSettings && (
              <Button 
                variant="outline" 
                onClick={onSettings}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Ρυθμίσεις
              </Button>
            )}
            {onLock && isEncryptionEnabled && (
              <Button 
                variant="outline" 
                onClick={onLock}
                className="gap-2"
              >
                <Lock className="h-4 w-4" />
                Κλείδωμα
              </Button>
            )}
            <Button 
              onClick={onAddKey}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Προσθήκη Κλειδιού
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
