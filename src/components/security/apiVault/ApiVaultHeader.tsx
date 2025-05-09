
import React from "react";
import { Button } from "@/components/ui/button";
import { Key, Download, Upload, Plus, Shield, Lock, LockIcon } from "lucide-react";
import { CardTitle } from "@/components/ui/card";

interface ApiVaultHeaderProps {
  isLocked: boolean;
  isEncryptionEnabled: boolean;
  onLock: () => void;
  onExport: () => void;
  onImport: () => void;
  onSettings: () => void;
  onAddKey: () => void;
  onUnlock: () => void;
}

export const ApiVaultHeader: React.FC<ApiVaultHeaderProps> = ({
  isLocked,
  isEncryptionEnabled,
  onLock,
  onExport,
  onImport,
  onSettings,
  onAddKey,
  onUnlock
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Key className="h-5 w-5 text-primary" />
        <CardTitle>Κλειδοθήκη API</CardTitle>
      </div>
      <div className="flex gap-2">
        {isLocked ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onUnlock}
          >
            <LockIcon className="mr-1 h-4 w-4" />
            Ξεκλείδωμα
          </Button>
        ) : (
          <>
            {isEncryptionEnabled && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onLock}
              >
                <Lock className="mr-1 h-4 w-4" />
                Κλείδωμα
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={onExport}
            >
              <Download className="mr-1 h-4 w-4" />
              Εξαγωγή
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onImport}
            >
              <Upload className="mr-1 h-4 w-4" />
              Εισαγωγή
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onSettings}
            >
              <Shield className="mr-1 h-4 w-4" />
              Ρυθμίσεις
            </Button>
            <Button 
              size="sm" 
              className="gap-1"
              onClick={onAddKey}
            >
              <Plus className="h-4 w-4" />
              Νέο Κλειδί
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
