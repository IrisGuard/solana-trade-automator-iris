
import React from 'react';
import { Database, RefreshCw } from "lucide-react";

interface BackupInfoProps {
  backupCount: number;
  maxBackups: number;
  lastBackupTime: Date | null | undefined;
}

export function BackupInfo({ backupCount, maxBackups, lastBackupTime }: BackupInfoProps) {
  return (
    <div>
      <h3 className="font-medium mb-1 text-sm">Αντίγραφα ασφαλείας</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-muted-foreground" />
          <span>Διαθέσιμα: {backupCount}/{maxBackups}</span>
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
          <span>
            {lastBackupTime 
              ? `${lastBackupTime.toLocaleTimeString()}`
              : 'Δεν υπάρχει'}
          </span>
        </div>
      </div>
    </div>
  );
}
