
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, RefreshCcw } from "lucide-react";
import { heliusService } from "@/services/helius/HeliusService";
import { heliusEndpointMonitor } from "@/services/helius/HeliusEndpointMonitor";
import { toast } from "sonner";

export function HeliusStatusMonitor() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [endpoints, setEndpoints] = useState<any[]>([]);
  
  const checkHeliusConnection = async () => {
    setStatus('checking');
    try {
      // First check if we can get token balances for a demo address
      await heliusService.fetchTokenBalances("vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg");
      
      // If that works, check endpoint statuses
      const endpointStatuses = await heliusEndpointMonitor.checkAllEndpoints();
      setEndpoints(endpointStatuses);
      
      // If we got this far, we're connected
      setStatus('connected');
      setLastChecked(new Date());
      
      // Show success message
      toast.success("Helius connection verified", {
        description: "API key is valid and endpoints are available"
      });
    } catch (error) {
      console.error("Failed to connect to Helius:", error);
      setStatus('error');
      setLastChecked(new Date());
      
      // Show error message
      toast.error("Helius connection failed", {
        description: "Check your API key and network connection"
      });
    }
  };
  
  useEffect(() => {
    // Check connection on initial load
    checkHeliusConnection();
    
    // Set up interval to check every 5 minutes
    const interval = setInterval(checkHeliusConnection, 5 * 60 * 1000);
    
    // Clean up on unmount
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Helius API Status</CardTitle>
        <CardDescription>
          Connection status for Helius blockchain API
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {status === 'checking' && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                Checking...
              </Badge>
            )}
            {status === 'connected' && (
              <Badge variant="outline" className="bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" /> Connected
              </Badge>
            )}
            {status === 'error' && (
              <Badge variant="outline" className="bg-red-100 text-red-800">
                <AlertCircle className="w-4 h-4 mr-1" /> Error
              </Badge>
            )}
            
            {lastChecked && (
              <span className="text-xs text-muted-foreground">
                Last checked: {lastChecked.toLocaleTimeString()}
              </span>
            )}
          </div>
          
          <Button size="sm" variant="outline" onClick={checkHeliusConnection}>
            <RefreshCcw className="w-4 h-4 mr-1" /> Check Now
          </Button>
        </div>
        
        {endpoints.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Endpoint Status</h4>
            <div className="grid grid-cols-2 gap-2">
              {endpoints.map((endpoint, index) => (
                <div key={index} className="text-xs flex items-center">
                  {endpoint.isWorking ? (
                    <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  {endpoint.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
