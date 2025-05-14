
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Code, Server, Database, Globe, RefreshCw, Pen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ApiEndpoint } from "@/utils/supabaseEndpoints";

interface EndpointsTabsProps {
  groupedEndpoints: Record<string, ApiEndpoint[]>;
  categories: string[];
  onEdit: (endpoint: ApiEndpoint) => void;
  onDelete: (id: string) => Promise<void> | void;
  loading?: boolean;
  onAddNew: () => void;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'rpc':
      return <Server className="h-4 w-4 mr-2" />;
    case 'api':
      return <Code className="h-4 w-4 mr-2" />;
    case 'database':
      return <Database className="h-4 w-4 mr-2" />;
    default:
      return <Globe className="h-4 w-4 mr-2" />;
  }
};

export function EndpointsTabs({
  groupedEndpoints,
  categories,
  onEdit,
  onDelete,
  loading = false,
  onAddNew
}: EndpointsTabsProps) {
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    toast.success('Αντιγράφηκε στο πρόχειρο!');
    
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${categories.length + 1}, minmax(0, 1fr))` }}>
        <TabsTrigger value="all">Όλα</TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value="all" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Όλα τα Endpoints</CardTitle>
            <CardDescription>Συγκεντρωτική λίστα όλων των διαθέσιμων API endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            {renderEndpointTable(
              Object.values(groupedEndpoints).flat(),
              handleCopy,
              copied,
              onEdit,
              onDelete,
              loading
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {categories.map((category) => (
        <TabsContent key={category} value={category} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {getCategoryIcon(category)}
                {category.charAt(0).toUpperCase() + category.slice(1)} Endpoints
              </CardTitle>
              <CardDescription>
                Endpoints για την κατηγορία {category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderEndpointTable(
                groupedEndpoints[category] || [],
                handleCopy,
                copied,
                onEdit,
                onDelete,
                loading
              )}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}

// Helper function to render the endpoint table
function renderEndpointTable(
  endpoints: ApiEndpoint[],
  handleCopy: (text: string) => void,
  copied: string | null,
  onEdit: (endpoint: ApiEndpoint) => void,
  onDelete: (id: string) => Promise<void> | void,
  loading?: boolean
) {
  if (endpoints.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Δεν υπάρχουν endpoints σε αυτήν την κατηγορία</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Όνομα</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Κατάσταση</TableHead>
            <TableHead className="text-right">Ενέργειες</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {endpoints.map((endpoint) => (
            <TableRow key={endpoint.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  {getCategoryIcon(endpoint.category || 'other')}
                  {endpoint.name}
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs truncate max-w-[200px]">
                {endpoint.url}
              </TableCell>
              <TableCell>
                <Badge variant={endpoint.is_active ? 'default' : 'outline'}>
                  {endpoint.is_active ? 'Ενεργό' : 'Ανενεργό'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(endpoint.url)}
                    title="Αντιγραφή URL"
                    disabled={loading}
                  >
                    {copied === endpoint.url ? 
                      <RefreshCw className="h-4 w-4 text-green-500" /> : 
                      <Copy className="h-4 w-4" />
                    }
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(endpoint)}
                    title="Επεξεργασία"
                    disabled={loading}
                  >
                    <Pen className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => endpoint.id && onDelete(endpoint.id)}
                    title="Διαγραφή"
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
