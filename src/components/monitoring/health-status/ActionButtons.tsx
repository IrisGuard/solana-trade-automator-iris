
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, AlertTriangle } from "lucide-react";

interface ActionButtonsProps {
  isChecking: boolean;
  isCreatingBackup: boolean;
  status: 'healthy' | 'warning' | 'critical';
  onCheckHealth: () => void;
  onCreateBackup: () => void;
  onRestoreBackup: () => void;
}

export function ActionButtons({ 
  isChecking, 
  isCreatingBackup, 
  status, 
  onCheckHealth, 
  onCreateBackup,
  onRestoreBackup
}: ActionButtonsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2 w-full">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={onCheckHealth}
          disabled={isChecking}
        >
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Έλεγχος...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Έλεγχος υγείας
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={onCreateBackup}
          disabled={isCreatingBackup}
        >
          {isCreatingBackup ? (
            <>
              <Database className="h-4 w-4 mr-2 animate-pulse" />
              Αποθήκευση...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Δημιουργία αντιγράφου
            </>
          )}
        </Button>
      </div>
      {status !== 'healthy' && (
        <Button 
          variant="destructive" 
          size="sm"
          className="w-full" 
          onClick={onRestoreBackup}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Επαναφορά από αντίγραφο
        </Button>
      )}
    </>
  );
}
