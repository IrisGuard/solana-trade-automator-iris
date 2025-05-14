
import React from "react";
import { ApiEndpoint } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ExternalLink, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface EndpointsListProps {
  endpoints: ApiEndpoint[];
  loading?: boolean;
  error?: string | null;
  onEdit?: (endpoint: ApiEndpoint) => void;
  onDelete?: (id: string) => Promise<void>;
}

export function EndpointsList({ endpoints, loading, error, onEdit, onDelete }: EndpointsListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-md p-4 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-14" />
              <Skeleton className="h-8 w-14" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-destructive">
        <Shield className="h-10 w-10 mx-auto mb-2" />
        <h3 className="font-medium">Σφάλμα φόρτωσης</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (endpoints.length === 0) {
    return (
      <div className="text-center py-10">
        <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
        <h3 className="font-medium">Δεν υπάρχουν καταχωρημένα endpoints</h3>
        <p className="text-sm text-muted-foreground">
          Προσθέστε νέα endpoints για χρήση στην πλατφόρμα
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {endpoints.map((endpoint) => (
        <div key={endpoint.id} className="border rounded-md p-4 hover:bg-secondary/30 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{endpoint.name}</h3>
                <Badge variant={endpoint.active ? "success" : "outline"}>
                  {endpoint.active ? "Ενεργό" : "Ανενεργό"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground break-all">{endpoint.url}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {onEdit && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onEdit(endpoint)}
                >
                  <Edit className="h-4 w-4 mr-1" /> 
                  Επεξεργασία
                </Button>
              )}
              {onDelete && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive"
                  onClick={() => onDelete(endpoint.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> 
                  Διαγραφή
                </Button>
              )}
            </div>
          </div>
          <div className="text-sm mt-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="font-medium">API Key:</span>
                <span>{endpoint.apiKey ? `${endpoint.apiKey.substring(0, 8)}...` : "—"}</span>
              </div>
              {endpoint.description && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Περιγραφή:</span>
                  <span>{endpoint.description}</span>
                </div>
              )}
            </div>
            <div className="mt-2">
              <a 
                href={endpoint.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary text-xs inline-flex items-center hover:underline"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Προβολή
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
