
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiEndpoint } from "./ApiEndpointsManager";
import { Loader2, ExternalLink } from "lucide-react";

export interface EndpointsListProps {
  endpoints: ApiEndpoint[];
  loading: boolean;
  error: string;
}

export function EndpointsList({ endpoints, loading, error }: EndpointsListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-destructive/10 p-4 rounded-md text-destructive text-center">
        {error}
      </div>
    );
  }
  
  if (endpoints.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No endpoints found for this category
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Visibility</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {endpoints.map((endpoint) => (
          <TableRow key={endpoint.id}>
            <TableCell>{endpoint.name}</TableCell>
            <TableCell className="font-mono text-sm">{endpoint.url}</TableCell>
            <TableCell>
              <Badge variant={endpoint.is_active ? "success" : "secondary"}>
                {endpoint.is_active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={endpoint.is_public ? "outline" : "default"}>
                {endpoint.is_public ? "Public" : "Private"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
