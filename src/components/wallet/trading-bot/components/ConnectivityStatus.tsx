
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

interface ConnectivityStatusProps {
  isConnected: boolean;
  label?: string;
}

export function ConnectivityStatus({ 
  isConnected, 
  label = isConnected ? 'Connected' : 'Disconnected' 
}: ConnectivityStatusProps) {
  return (
    <Badge variant={isConnected ? "success" : "destructive"} className="flex items-center gap-1">
      {isConnected ? (
        <CheckCircle className="h-3.5 w-3.5" />
      ) : (
        <XCircle className="h-3.5 w-3.5" />
      )}
      {label}
    </Badge>
  );
}

export default ConnectivityStatus;
