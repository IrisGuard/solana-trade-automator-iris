
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ApiEndpoint } from "./ApiEndpointsManager";

export interface EndpointsListProps {
  endpoints: ApiEndpoint[];
  loading: boolean;
  error: string | null;
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
      <div className="py-4 text-center text-destructive">
        <p>Σφάλμα φόρτωσης endpoints</p>
      </div>
    );
  }

  if (endpoints.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>Δεν υπάρχουν διαθέσιμα endpoints</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Όνομα</TableHead>
            <TableHead>Κατηγορία</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Κατάσταση</TableHead>
            <TableHead>Πρόσβαση</TableHead>
            <TableHead className="w-[100px]">Ενεργό</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {endpoints.map((endpoint) => (
            <TableRow key={endpoint.id}>
              <TableCell className="font-medium">{endpoint.name}</TableCell>
              <TableCell>{endpoint.category}</TableCell>
              <TableCell className="font-mono text-xs truncate max-w-[200px]">
                {endpoint.url}
              </TableCell>
              <TableCell>
                <Badge variant={endpoint.is_active ? "success" : "secondary"}>
                  {endpoint.is_active ? 'Ενεργό' : 'Ανενεργό'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={endpoint.is_public ? "outline" : "default"}>
                  {endpoint.is_public ? 'Δημόσιο' : 'Ιδιωτικό'}
                </Badge>
              </TableCell>
              <TableCell>
                <Switch 
                  checked={endpoint.is_active} 
                  onCheckedChange={() => {}} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
