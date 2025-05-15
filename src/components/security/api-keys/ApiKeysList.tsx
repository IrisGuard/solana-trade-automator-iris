
import React from 'react';
import { ApiKeyWithState } from '@/services/api-keys/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, EyeOff, RefreshCw, Trash2, Check } from "lucide-react";

interface ApiKeysListProps {
  apiKeys: ApiKeyWithState[];
  toggleKeyVisibility: (keyId: string) => void;
  onCopy: (text: string) => void;
  onDelete: (keyId: string) => void;
  onTest: (key: ApiKeyWithState) => Promise<boolean>;
  isKeyVisible: (keyId: string) => boolean;
  isCopied: (text: string) => boolean;
  isKeyTesting: (keyId: string) => boolean;
  formatDate: (dateString: string) => string;
  formatKeyDisplay: (key: string, isVisible: boolean) => string;
}

export function ApiKeysList({
  apiKeys,
  toggleKeyVisibility,
  onCopy,
  onDelete,
  onTest,
  isKeyVisible,
  isCopied,
  isKeyTesting,
  formatDate,
  formatKeyDisplay
}: ApiKeysListProps) {
  if (apiKeys.length === 0) {
    return (
      <div className="text-center p-4 border rounded-md">
        <p className="text-muted-foreground">No API keys found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((key) => {
            // Get color for the status badge
            const statusColor = 
              key.status === 'active' ? 'success' : 
              key.status === 'failing' ? 'destructive' : 
              key.status === 'expired' ? 'warning' : 'default';
              
            return (
              <TableRow key={key.id}>
                <TableCell className="font-medium">
                  {key.name}
                </TableCell>
                <TableCell className="capitalize">
                  {key.service}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {formatKeyDisplay(key.key_value, isKeyVisible(key.id))}
                </TableCell>
                <TableCell>
                  <Badge variant={statusColor as any}>
                    {key.status || 'active'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDate(key.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleKeyVisibility(key.id)}
                      title={isKeyVisible(key.id) ? 'Hide key' : 'Show key'}
                    >
                      {isKeyVisible(key.id) ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCopy(key.key_value)}
                      title="Copy key"
                    >
                      {isCopied(key.key_value) ? 
                        <Check className="h-4 w-4 text-green-500" /> : 
                        <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onTest(key)}
                      title="Test key"
                      disabled={isKeyTesting(key.id)}
                    >
                      <RefreshCw className={`h-4 w-4 ${isKeyTesting(key.id) ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(key.id)}
                      title="Delete key"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
