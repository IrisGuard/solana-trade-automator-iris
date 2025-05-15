
import React from 'react';
import { ApiKeyWithState } from '@/services/api-keys/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, EyeOff, RefreshCw, Trash2, Check } from "lucide-react";

interface ApiKeysByServiceProps {
  keysByService: Record<string, ApiKeyWithState[]>;
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

export function ApiKeysByService({
  keysByService,
  toggleKeyVisibility,
  onCopy,
  onDelete,
  onTest,
  isKeyVisible,
  isCopied,
  isKeyTesting,
  formatDate,
  formatKeyDisplay
}: ApiKeysByServiceProps) {
  const services = Object.keys(keysByService);
  
  if (services.length === 0) {
    return (
      <div className="text-center p-4 border rounded-md">
        <p className="text-muted-foreground">No API keys found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {services.map((service) => (
        <Card key={service} className="overflow-hidden">
          <CardHeader className="bg-muted">
            <CardTitle className="capitalize text-md flex items-center gap-2">
              {service}
              <Badge className="ml-2">{keysByService[service].length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {keysByService[service].map((key) => {
                // Get color for the status badge
                const statusColor = 
                  key.status === 'active' ? 'success' : 
                  key.status === 'failing' ? 'destructive' : 
                  key.status === 'expired' ? 'warning' : 'default';
                  
                return (
                  <div key={key.id} className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{key.name}</div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-mono text-xs">
                          {formatKeyDisplay(key.key_value, isKeyVisible(key.id))}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={statusColor as any}>
                          {key.status || 'active'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Created: {formatDate(key.created_at)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
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
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
