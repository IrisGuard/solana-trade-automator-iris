
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Code, Server, Database, Globe, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const mockEndpoints = [
  { id: 1, name: 'Solana RPC Endpoint', url: 'https://api.mainnet-beta.solana.com', category: 'rpc', status: 'active' },
  { id: 2, name: 'Helius Mainnet', url: 'https://mainnet.helius-rpc.com/?api-key={API_KEY}', category: 'rpc', status: 'active' },
  { id: 3, name: 'NFT Metadata API', url: 'https://api.helius.xyz/v1/nfts/metadata?api-key={API_KEY}', category: 'nft', status: 'inactive' },
  { id: 4, name: 'Solscan API', url: 'https://public-api.solscan.io/transaction/{TX_ID}', category: 'explorer', status: 'active' },
];

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

export function EndpointsTabs() {
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
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="all">Όλα</TabsTrigger>
        <TabsTrigger value="rpc">RPC</TabsTrigger>
        <TabsTrigger value="nft">NFT</TabsTrigger>
        <TabsTrigger value="explorer">Explorer</TabsTrigger>
      </TabsList>
      
      {['all', 'rpc', 'nft', 'explorer'].map((tab) => (
        <TabsContent key={tab} value={tab}>
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>Διαθέσιμα endpoints για χρήση στην εφαρμογή</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Όνομα</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Κατηγορία</TableHead>
                      <TableHead>Κατάσταση</TableHead>
                      <TableHead className="text-right">Ενέργειες</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEndpoints
                      .filter(endpoint => tab === 'all' || endpoint.category === tab)
                      .map((endpoint) => (
                        <TableRow key={endpoint.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              {getCategoryIcon(endpoint.category)}
                              {endpoint.name}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs truncate max-w-[200px]">
                            {endpoint.url}
                          </TableCell>
                          <TableCell className="capitalize">{endpoint.category}</TableCell>
                          <TableCell>
                            <Badge variant={endpoint.status === 'active' ? 'default' : 'outline'}>
                              {endpoint.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCopy(endpoint.url)}
                              title="Αντιγραφή URL"
                            >
                              {copied === endpoint.url ? 
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
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
