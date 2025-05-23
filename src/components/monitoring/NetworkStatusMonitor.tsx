
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { errorCollector } from '@/utils/error-handling/collector';

interface NetworkStatus {
  isOnline: boolean;
  connectionType: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

export function NetworkStatusMonitor() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    connectionType: 'unknown'
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      try {
        setNetworkStatus({
          isOnline: navigator.onLine,
          connectionType: connection?.type || 'unknown',
          effectiveType: connection?.effectiveType,
          downlink: connection?.downlink,
          rtt: connection?.rtt
        });
      } catch (error) {
        errorCollector.captureError(error, {
          component: 'NetworkStatusMonitor',
          source: 'networkStatusUpdate',
          details: { connectionInfo: !!connection }
        });
      }
    };

    const handleOnline = () => updateNetworkStatus();
    const handleOffline = () => updateNetworkStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial status check
    updateNetworkStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusColor = () => {
    if (!networkStatus.isOnline) return 'destructive';
    if (networkStatus.effectiveType === 'slow-2g' || networkStatus.effectiveType === '2g') return 'warning';
    return 'default';
  };

  const getStatusIcon = () => {
    if (!networkStatus.isOnline) return <WifiOff className="h-4 w-4" />;
    if (networkStatus.effectiveType === 'slow-2g' || networkStatus.effectiveType === '2g') return <AlertTriangle className="h-4 w-4" />;
    return <Wifi className="h-4 w-4" />;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {getStatusIcon()}
          Network Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge variant={getStatusColor()}>
            {networkStatus.isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>
        
        {networkStatus.isOnline && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Connection:</span>
              <span className="text-sm">{networkStatus.connectionType}</span>
            </div>
            
            {networkStatus.effectiveType && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Speed:</span>
                <span className="text-sm">{networkStatus.effectiveType}</span>
              </div>
            )}
            
            {networkStatus.downlink && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bandwidth:</span>
                <span className="text-sm">{networkStatus.downlink} Mbps</span>
              </div>
            )}
            
            {networkStatus.rtt && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Latency:</span>
                <span className="text-sm">{networkStatus.rtt} ms</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
