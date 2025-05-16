
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Key, Plus, Eye, EyeOff, Copy, RefreshCw, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ApiKeyWithState } from "@/services/api-keys/types";
import { useUser } from "@/hooks/useUser";
import { useApiKeyVisibility } from "@/hooks/api-keys/useApiKeyVisibility";

export function ApiKeysSection() {
  const [apiKeys, setApiKeys] = useState<ApiKeyWithState[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const { user } = useUser();
  const { visibleKeyIds, toggleKeyVisibility, formatKeyDisplay } = useApiKeyVisibility();

  useEffect(() => {
    if (user) {
      fetchApiKeys();
    }
  }, [user]);

  const fetchApiKeys = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('user_id', user.id)
        .limit(4); // Limit to 4 for dashboard preview
      
      if (error) throw error;
      
      const mappedKeys = data?.map(key => ({
        ...key,
        isVisible: false,
        isWorking: key.status === 'active',
      })) || [];
      
      setApiKeys(mappedKeys);
    } catch (err) {
      console.error('Error fetching API keys:', err);
      toast.error('Σφάλμα κατά τη φόρτωση των κλειδιών API');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (keyValue: string, id: string) => {
    navigator.clipboard.writeText(keyValue);
    setCopiedKeyId(id);
    toast.success('Το κλειδί αντιγράφηκε στο πρόχειρο!');
    
    setTimeout(() => {
      setCopiedKeyId(null);
    }, 2000);
  };

  const handleAddNewKey = () => {
    // Navigate to API vault page or open a dialog
    window.location.href = '/api-vault';
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            Κλειδιά API
          </CardTitle>
          <CardDescription>Φόρτωση κλειδιών API...</CardDescription>
        </CardHeader>
        <CardContent className="h-[100px] flex items-center justify-center">
          <div className="animate-pulse">Φόρτωση...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Κλειδιά API
          </CardTitle>
          <CardDescription>
            {apiKeys.length > 0 
              ? `${apiKeys.length} αποθηκευμένα κλειδιά` 
              : 'Δεν υπάρχουν αποθηκευμένα κλειδιά API'}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchApiKeys}
            className="gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ανανέωση</span>
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleAddNewKey}
            className="gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Προσθήκη</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {apiKeys.length > 0 ? (
          <div className="overflow-hidden border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Όνομα</TableHead>
                  <TableHead>Υπηρεσία</TableHead>
                  <TableHead className="hidden md:table-cell">Κατάσταση</TableHead>
                  <TableHead className="text-right">Ενέργειες</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>{key.name}</TableCell>
                    <TableCell className="capitalize">{key.service}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={key.status === 'active' ? 'default' : 'secondary'}>
                        {key.status || 'active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
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
                          onClick={() => handleCopy(key.key_value, key.id)}
                          disabled={!key.key_value}
                          title="Αντιγραφή κλειδιού"
                        >
                          {copiedKeyId === key.id ? 
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
          <div className="text-center py-6 border rounded-md flex flex-col items-center justify-center">
            <KeyRound className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-4">Δεν υπάρχουν αποθηκευμένα κλειδιά API</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddNewKey}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Προσθήκη κλειδιού API
            </Button>
          </div>
        )}
        {apiKeys.length > 0 && (
          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={handleAddNewKey}
              className="text-sm"
            >
              Προβολή όλων των κλειδιών API
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
