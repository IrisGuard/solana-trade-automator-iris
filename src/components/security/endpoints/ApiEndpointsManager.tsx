
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EndpointsList } from "./EndpointsList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewEndpointDialog } from "./NewEndpointDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define ApiEndpoint consistent with EndpointsList
export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  category: string;
  is_active: boolean;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ApiEndpointsManagerProps {
  category: string;
}

export function ApiEndpointsManager({ category }: ApiEndpointsManagerProps) {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNewDialog, setShowNewDialog] = useState(false);
  
  // Load endpoints from DB
  useEffect(() => {
    loadEndpoints();
  }, [category]);
  
  const loadEndpoints = async () => {
    try {
      setIsLoading(true);
      
      // Mock API call - replace with actual call to your backend
      setTimeout(() => {
        const mockEndpoints: ApiEndpoint[] = [
          {
            id: "1",
            name: "Solana RPC Endpoint",
            url: "https://api.mainnet-beta.solana.com",
            category: "solana",
            is_active: true,
            is_public: true
          },
          {
            id: "2",
            name: "Solscan API",
            url: "https://public-api.solscan.io",
            category: "solana",
            is_active: true,
            is_public: false
          }
        ].filter(ep => ep.category === category);
        
        setEndpoints(mockEndpoints);
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error("Error loading endpoints:", err);
      setError("Failed to load endpoints");
      setIsLoading(false);
    }
  };
  
  const handleAddEndpoint = (endpoint: ApiEndpoint) => {
    setEndpoints([...endpoints, endpoint]);
    toast.success(`Added endpoint: ${endpoint.name}`);
    setShowNewDialog(false);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>API Endpoints ({category})</CardTitle>
        <Button size="sm" onClick={() => setShowNewDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Endpoint
        </Button>
      </CardHeader>
      <CardContent>
        <EndpointsList 
          endpoints={endpoints} 
          loading={isLoading} 
          error={error}
        />
        
        {showNewDialog && (
          <NewEndpointDialog
            category={category}
            onAddEndpoint={handleAddEndpoint}
            onCancel={() => setShowNewDialog(false)}
          />
        )}
      </CardContent>
    </Card>
  );
}
