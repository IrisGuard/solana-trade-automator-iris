
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Copy, RefreshCw, Eye, EyeOff, Plus, KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { useApiKeyVisibility } from "@/hooks/api-keys/useApiKeyVisibility";

// Define the SupabaseApiKey interface
interface SupabaseApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  created_at: string;
}

export function SupabaseApiKeysList() {
  const [keys, setKeys] = useState<SupabaseApiKey[]>([]);
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { user } = useAuth();
  const { visibleKeyIds, toggleKeyVisibility, formatKeyDisplay } = useApiKeyVisibility();

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (user) {
        // Fetch the user's API keys from Supabase
        const { data: keysData, error: keysError } = await supabase
          .from('api_keys_storage')
          .select('*')
          .eq('user_id', user.id);
          
        if (keysError) throw keysError;
        
        // Map the data to match SupabaseApiKey interface
        if (keysData && keysData.length > 0) {
          const formattedKeys: SupabaseApiKey[] = keysData.map(item => ({
            id: item.id,
            name: item.name,
            key: item.key_value,
            service: item.service,
            created_at: item.created_at
          }));
          setKeys(formattedKeys);
        } else {
          // Empty array if no keys found
          setKeys([]);
        }
      } else {
        // Not logged in - show empty state
        setKeys([]);
      }
      
      // Fetch all endpoints
      const { data: endpointsData, error: endpointsError } = await supabase
        .from('api_endpoints')
        .select('*');
        
      if (endpointsError) throw endpointsError;
      setEndpoints(endpointsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Σφάλμα κατά τη φόρτωση των δεδομένων');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    toast.success('Αντιγράφηκε στο πρόχειρο!');
    
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };
  
  const handleAddNewKey = () => {
    // Placeholder for adding new keys functionality
    toast.info("Λειτουργία προσθήκης νέου κλειδιού API");
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Κλειδιά API & Endpoints στο Supabase</CardTitle>
          <CardDescription>
            Φόρτωση δεδομένων...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Κλειδιά API στο Supabase</CardTitle>
          <CardDescription>
            {user ? 'Προβολή των αποθηκευμένων κλειδιών API και endpoints' : 'Συνδεθείτε για να δείτε τα κλειδιά API σας'}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchData}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Ανανέωση
          </Button>
          {user && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleAddNewKey}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Προσθήκη
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">API Κλειδιά</h3>
            {keys.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Όνομα</TableHead>
                      <TableHead>Υπηρεσία</TableHead>
                      <TableHead>Κλειδί</TableHead>
                      <TableHead>Κατάσταση</TableHead>
                      <TableHead className="text-right">Ενέργειες</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-medium">{key.name}</TableCell>
                        <TableCell className="capitalize">{key.service}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {formatKeyDisplay(key.key, visibleKeyIds[key.id])}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">
                            active
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleKeyVisibility(key.id)}
                              title={visibleKeyIds[key.id] ? 'Απόκρυψη κλειδιού' : 'Εμφάνιση κλειδιού'}
                            >
                              {visibleKeyIds[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCopy(key.key)}
                              title="Αντιγραφή"
                              disabled={!key.key}
                            >
                              {copiedKey === key.key ? 
                                <RefreshCw className="h-4 w-4 text-green-500" /> : 
                                <Copy className="h-4 w-4" />
                              }
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 border rounded-md flex flex-col items-center justify-center">
                <KeyRound className="h-10 w-10 text-muted-foreground mb-2" />
                {user ? (
                  <>
                    <p className="mt-2 text-muted-foreground">Δεν υπάρχουν αποθηκευμένα κλειδιά API</p>
                    <p className="text-sm text-muted-foreground mb-4">Προσθέστε τα πραγματικά σας κλειδιά API για να χρησιμοποιήσετε τις υπηρεσίες</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-1"
                      onClick={handleAddNewKey}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Προσθήκη κλειδιού API
                    </Button>
                  </>
                ) : (
                  <p className="mt-2 text-muted-foreground">Συνδεθείτε για να δείτε τα κλειδιά API σας</p>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Endpoints</h3>
            {endpoints.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Όνομα</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Κατηγορία</TableHead>
                      <TableHead className="text-right">Ενέργειες</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {endpoints.map((endpoint) => (
                      <TableRow key={endpoint.id}>
                        <TableCell className="font-medium">{endpoint.name}</TableCell>
                        <TableCell className="font-mono text-xs truncate max-w-[200px]">
                          {endpoint.url}
                        </TableCell>
                        <TableCell className="capitalize">{endpoint.category}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(endpoint.url)}
                            title="Αντιγραφή URL"
                          >
                            {copiedKey === endpoint.url ? 
                              <RefreshCw className="h-4 w-4 text-green-500" /> : 
                              <Copy className="h-4 w-4" />
                            }
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 border rounded-md">
                <p className="mt-2 text-muted-foreground">Δεν υπάρχουν αποθηκευμένα endpoints</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
