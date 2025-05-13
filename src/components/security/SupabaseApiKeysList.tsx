
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Copy, RefreshCw, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/providers/SupabaseAuthProvider";

export function SupabaseApiKeysList() {
  const [keys, setKeys] = useState<any[]>([]);
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Always show demo key if not logged in
      const demoKey = {
        id: 'demo',
        name: 'Helius API Demo Key',
        service: 'helius',
        key_value: 'ddb32813-1f4b-459d-8964-310b1b73a053',
        status: 'active'
      };
      
      if (user) {
        // Fetch all API keys if user is logged in
        const { data: keysData, error: keysError } = await supabase
          .from('api_keys_storage')
          .select('*');
          
        if (keysError) throw keysError;
        
        // If no keys found and user is logged in, show demo key
        if (!keysData || keysData.length === 0) {
          setKeys([demoKey]);
        } else {
          setKeys(keysData);
        }
      } else {
        // Not logged in - show demo key
        setKeys([demoKey]);
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

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    toast.success('Αντιγράφηκε στο πρόχειρο!');
    
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const formatKeyDisplay = (key: string, isVisible: boolean) => {
    if (isVisible) {
      return key;
    }
    return key ? `${key.substring(0, 4)}...${key.substring(key.length - 4)}` : '';
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
            Προβολή των αποθηκευμένων κλειδιών API και endpoints
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchData}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Ανανέωση
        </Button>
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
                          {formatKeyDisplay(key.key_value, visibleKeys[key.id])}
                        </TableCell>
                        <TableCell>
                          <Badge variant={key.status === 'active' ? 'success' : 'secondary'}>
                            {key.status || 'active'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleKeyVisibility(key.id)}
                              title={visibleKeys[key.id] ? 'Απόκρυψη κλειδιού' : 'Εμφάνιση κλειδιού'}
                            >
                              {visibleKeys[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCopy(key.key_value)}
                              title="Αντιγραφή"
                              disabled={!key.key_value}
                            >
                              {copiedKey === key.key_value ? 
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
              <div className="text-center py-8 border rounded-md">
                <p className="mt-2 text-muted-foreground">Δεν υπάρχουν αποθηκευμένα κλειδιά API</p>
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
