
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StatusIndicatorButton } from './StatusIndicatorButton';
import { HealthStatusContent } from './HealthStatusContent';
import { useHealthStatus } from './useHealthStatus';

export function HealthStatusPopover() {
  const {
    isOpen,
    setIsOpen,
    health,
    isCreatingBackup,
    isChecking,
    statusText,
    checkSystemHealth,
    createBackup,
    restoreBackup
  } = useHealthStatus();

  const statusColors = {
    healthy: "bg-emerald-500",
    warning: "bg-amber-500",
    critical: "bg-red-500"
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <StatusIndicatorButton 
          status={health.status} 
          onClick={() => setIsOpen(true)}
        />
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <HealthStatusContent 
          health={health}
          statusText={statusText}
          statusColors={statusColors}
          isChecking={isChecking}
          isCreatingBackup={isCreatingBackup}
          onCheckHealth={() => checkSystemHealth()}
          onCreateBackup={createBackup}
          onRestoreBackup={restoreBackup}
        />
      </PopoverContent>
    </Popover>
  );
}
