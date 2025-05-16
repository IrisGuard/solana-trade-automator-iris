
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

type HealthStatus = 'healthy' | 'warning' | 'critical';

interface StatusIndicatorButtonProps {
  status: HealthStatus;
  onClick: () => void;
}

export function StatusIndicatorButton({ status, onClick }: StatusIndicatorButtonProps) {
  const statusColors = {
    healthy: "bg-emerald-500",
    warning: "bg-amber-500",
    critical: "bg-red-500"
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={`relative rounded-full h-8 w-8 p-0 ${statusColors[status]} border-white/20 hover:${statusColors[status]}/80`}
      onClick={onClick}
      aria-label="Κατάσταση υγείας συστήματος"
    >
      <Shield className="h-4 w-4 text-white" />
      {status !== 'healthy' && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/70 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
      )}
    </Button>
  );
}
