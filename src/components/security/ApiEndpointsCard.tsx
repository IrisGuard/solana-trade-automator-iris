
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { API_ENDPOINTS, API_KEYS, RPC_ENDPOINTS } from "@/services/solana/config";
import { toast } from "sonner";

export const ApiEndpointsCard = () => {
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Μετατροπή των αντικειμένων σε arrays για ευκολότερη προβολή
  const rpcEndpoints = Object.entries(RPC_ENDPOINTS);
  const apiEndpoints = Object.entries(API_ENDPOINTS);

  const handleCopy = (value: string, name: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(name);
    toast.success(`Αντιγράφηκε: ${name}`);
    
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Endpoints</CardTitle>
        <CardDescription>
          Προβολή των endpoints που χρησιμοποιεί η εφαρμογή
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rpc" className="space-y-4">
          <TabsList>
            <TabsTrigger value="rpc">RPC Endpoints</TabsTrigger>
            <TabsTrigger value="api">API Endpoints</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rpc" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Όνομα</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead className="w-[100px] text-right">Ενέργειες</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rpcEndpoints.map(([name, url]) => (
                    <TableRow key={name}>
                      <TableCell className="font-medium">{name}</TableCell>
                      <TableCell className="font-mono text-xs truncate max-w-[300px]">
                        {url as string}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleCopy(url as string, name)}
                        >
                          {copiedKey === name ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Υπηρεσία</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead className="w-[100px] text-right">Ενέργειες</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiEndpoints.map(([name, url]) => (
                    <TableRow key={name}>
                      <TableCell className="font-medium">{name}</TableCell>
                      <TableCell className="font-mono text-xs truncate max-w-[300px]">
                        {url as string}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleCopy(url as string, name)}
                        >
                          {copiedKey === name ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
