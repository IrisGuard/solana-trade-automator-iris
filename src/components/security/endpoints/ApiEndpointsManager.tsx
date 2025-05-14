
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { EndpointsList } from "./EndpointsList";
import { useGetEndpoints } from "@/hooks/useGetEndpoints";
import { toast } from "sonner";

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  category: string;
  is_active: boolean;
  is_public: boolean;
}

export function ApiEndpointsManager() {
  const { endpoints, isLoading, error, refetch } = useGetEndpoints();
  const [showAddEndpoint, setShowAddEndpoint] = useState(false);

  const handleRefresh = () => {
    toast.promise(refetch(), {
      loading: 'Ανανέωση endpoints...',
      success: 'Τα endpoints ανανεώθηκαν με επιτυχία',
      error: 'Αποτυχία ανανέωσης endpoints'
    });
  };

  useEffect(() => {
    if (error) {
      toast.error('Σφάλμα φόρτωσης endpoints', {
        description: error
      });
    }
  }, [error]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>API Endpoints</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Ανανέωση
          </Button>
          <Button 
            size="sm"
            onClick={() => setShowAddEndpoint(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Προσθήκη
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <EndpointsList 
          endpoints={endpoints} 
          loading={isLoading} 
          error={error} 
        />
      </CardContent>
    </Card>
  );
}
