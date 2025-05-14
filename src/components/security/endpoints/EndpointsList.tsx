
import React from "react";
import { ApiEndpoint } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EndpointsListProps {
  endpoints: ApiEndpoint[];
  onEdit: (endpoint: ApiEndpoint) => void;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

export function EndpointsList({ endpoints, onEdit, onDelete, loading }: EndpointsListProps) {
  if (loading) {
    return (
      <div className="text-center py-6">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-muted-foreground">Φόρτωση endpoints...</p>
      </div>
    );
  }
  
  if (endpoints.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">Δεν βρέθηκαν endpoints σε αυτήν την κατηγορία</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {endpoints.map((endpoint) => (
        <div key={endpoint.id} className="flex items-center justify-between p-3 border rounded-md bg-card">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{endpoint.name}</span>
              <Badge variant={endpoint.is_active ? "success" : "secondary"} className="ml-2">
                {endpoint.is_active ? "Ενεργό" : "Ανενεργό"}
              </Badge>
              {endpoint.is_public && <Badge variant="outline">Public</Badge>}
            </div>
            <div className="text-sm text-muted-foreground mt-1 break-all">{endpoint.url}</div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(endpoint)}
              disabled={loading}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => endpoint.id && onDelete(endpoint.id)}
              disabled={loading}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
