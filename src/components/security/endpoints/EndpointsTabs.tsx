
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ApiEndpoint } from "@/utils/supabaseEndpoints";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Edit, Trash2, Globe, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/SupabaseAuthProvider";

type EndpointsTabsProps = {
  groupedEndpoints: Record<string, ApiEndpoint[]>;
  categories: string[];
  onEdit: (endpoint: ApiEndpoint) => void;
  onDelete: (id: string) => void;
  loading: boolean;
  onAddNew: () => void;
};

export const EndpointsTabs = ({
  groupedEndpoints,
  categories,
  onEdit,
  onDelete,
  loading,
  onAddNew
}: EndpointsTabsProps) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const { user } = useAuth();

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success('URL Αντιγράφηκε');
    
    setTimeout(() => {
      setCopiedUrl(null);
    }, 2000);
  };

  return (
    <Tabs defaultValue={categories[0] || "solana"} className="w-full">
      <TabsList className="mb-4 overflow-auto">
        {categories.map(category => (
          <TabsTrigger key={category} value={category} className="capitalize">
            {category}
            <Badge variant="outline" className="ml-2">
              {groupedEndpoints[category].length}
            </Badge>
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map(category => (
        <TabsContent key={category} value={category}>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Όνομα</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="w-[120px]">Κατάσταση</TableHead>
                  <TableHead className="text-right w-[150px]">Ενέργειες</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedEndpoints[category].map((endpoint) => (
                  <TableRow key={endpoint.id}>
                    <TableCell className="font-medium">{endpoint.name}</TableCell>
                    <TableCell className="font-mono text-xs truncate max-w-[300px]">
                      {endpoint.url}
                    </TableCell>
                    <TableCell>
                      {endpoint.is_active ? 
                        <Badge variant="success">Ενεργό</Badge> : 
                        <Badge variant="secondary">Ανενεργό</Badge>
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(endpoint.url)}
                        >
                          {copiedUrl === endpoint.url ? 
                            <Check className="h-4 w-4" /> : 
                            <Copy className="h-4 w-4" />
                          }
                        </Button>
                        {user && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(endpoint)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => endpoint.id && onDelete(endpoint.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {groupedEndpoints[category].length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Globe className="h-12 w-12 mb-2 opacity-50" />
                        <p>Δεν υπάρχουν endpoints σε αυτή την κατηγορία</p>
                        <Button 
                          variant="link"
                          onClick={onAddNew}
                          className="mt-2"
                        >
                          Προσθήκη νέου endpoint
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
