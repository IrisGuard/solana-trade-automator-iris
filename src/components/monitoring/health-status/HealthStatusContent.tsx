
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { IssuesAlert } from './IssuesAlert';
import { BackupInfo } from './BackupInfo';
import { ActionButtons } from './ActionButtons';
import { HealthState } from './types';

interface HealthStatusContentProps {
  health: HealthState;
  statusText: Record<string, string>;
  statusColors: Record<string, string>;
  isChecking: boolean;
  isCreatingBackup: boolean;
  onCheckHealth: () => void;
  onCreateBackup: () => void;
  onRestoreBackup: () => void;
}

export function HealthStatusContent({
  health,
  statusText,
  statusColors,
  isChecking,
  isCreatingBackup,
  onCheckHealth,
  onCreateBackup,
  onRestoreBackup
}: HealthStatusContentProps) {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <Badge 
          className={`${statusColors[health.status]} text-white font-medium mb-1`}
          variant="outline"
        >
          {statusText[health.status]}
        </Badge>
        <CardTitle className="text-lg">Κατάσταση Συστήματος</CardTitle>
        <CardDescription>
          Τελευταίος έλεγχος: {health.lastChecked.toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <IssuesAlert issues={health.issues} status={health.status} />
        <BackupInfo 
          backupCount={health.backupCount} 
          maxBackups={health.maxBackups} 
          lastBackupTime={health.lastBackupTime} 
        />
      </CardContent>
      <CardFooter className="px-0 pt-2 flex flex-col gap-2">
        <ActionButtons 
          isChecking={isChecking}
          isCreatingBackup={isCreatingBackup}
          status={health.status}
          onCheckHealth={onCheckHealth}
          onCreateBackup={onCreateBackup}
          onRestoreBackup={onRestoreBackup}
        />
      </CardFooter>
    </Card>
  );
}
