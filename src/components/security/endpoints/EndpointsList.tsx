
import React from "react";
import { Button } from "@/components/ui/button";
import { ApiEndpoint } from "@/types/api";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EndpointsListProps {
  endpoints: ApiEndpoint[];
  onEdit: (endpoint: ApiEndpoint) => void;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

export function EndpointsList({ endpoints, onEdit, onDelete, loading }: EndpointsListProps) {
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (endpoints.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Δεν υπάρχουν endpoints σε αυτήν την κατηγορία
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {endpoints.map((endpoint) => (
        <div key={endpoint.id} className="flex items-center justify-between p-3 border rounded-md">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium">{endpoint.name}</span>
              {endpoint.is_active ? (
                <Badge variant="success">Ενεργό</Badge>
              ) : (
                <Badge variant="destructive">Ανενεργό</Badge>
              )}
              {endpoint.is_public ? (
                <Badge variant="outline">Δημόσιο</Badge>
              ) : (
                <Badge variant="outline">Ιδιωτικό</Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-1 break-all">{endpoint.url}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(endpoint)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => handleDelete(endpoint.id)}
              disabled={deletingId === endpoint.id || loading}
            >
              {deletingId === endpoint.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 text-destructive" />
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
