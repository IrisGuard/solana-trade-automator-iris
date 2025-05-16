
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Copy, RefreshCw } from "lucide-react";
import { ApiKeyWithState } from "@/services/api-keys/types";
import { formatKeyDisplay } from '@/hooks/api-keys/useApiKeyVisibility';

interface ApiKeysListProps {
  apiKeys: ApiKeyWithState[];
  visibleKeyIds: Record<string, boolean>;
  copiedKeyId: string | null;
  onToggleVisibility: (id: string) => void;
  onCopy: (keyValue: string, id: string) => void;
}

export function ApiKeysList({
  apiKeys,
  visibleKeyIds,
  copiedKeyId,
  onToggleVisibility,
  onCopy
}: ApiKeysListProps) {
  return (
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
                  {key.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleVisibility(key.id)}
                    title={visibleKeyIds[key.id] ? 'Απόκρυψη κλειδιού' : 'Εμφάνιση κλειδιού'}
                  >
                    {visibleKeyIds[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onCopy(key.key_value, key.id)}
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
  );
}
