
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiEndpoint } from "@/types/api";

interface EndpointsListProps {
  endpoints: ApiEndpoint[];
  isLoading?: boolean;
  error?: string | null;
}

export function EndpointsList({ endpoints, isLoading, error }: EndpointsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!endpoints || endpoints.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4 text-center text-muted-foreground">
          No endpoints available for this category
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {endpoints.map((endpoint) => (
        <Card key={endpoint.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{endpoint.name}</h3>
                <Badge variant={endpoint.status === 'active' ? 'success' : 'secondary'}>
                  {endpoint.status || 'active'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{endpoint.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant={getMethodVariant(endpoint.method)}>
                  {endpoint.method}
                </Badge>
                <span className="font-mono text-xs bg-secondary px-2 py-1 rounded">{endpoint.url}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Helper to get different badge variants for different HTTP methods
function getMethodVariant(method: string): "default" | "destructive" | "outline" | "secondary" | "success" {
  switch (method) {
    case "GET":
      return "default";
    case "POST":
      return "success";
    case "PUT":
      return "secondary";
    case "DELETE":
      return "destructive";
    default:
      return "outline";
  }
}
