
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Check, RefreshCw, Trash, AlertCircle } from "lucide-react";
import { ApiKeyWithState } from "@/services/api-keys/types";

interface ApiKeyItemProps {
  apiKey: ApiKeyWithState;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onCopy: (text: string) => void;
  onDelete: (id: string) => void;
  onTest: (apiKey: ApiKeyWithState) => Promise<boolean>;
  isCopied: boolean;
  isTesting: boolean;
  formatDate: (date: string) => string;
  formatKeyDisplay: (key: string, isVisible: boolean) => string;
}

export function ApiKeyItem({
  apiKey,
  isVisible,
  onToggleVisibility,
  onCopy,
  onDelete,
  onTest,
  isCopied,
  isTesting,
  formatDate,
  formatKeyDisplay
}: ApiKeyItemProps) {
  const getBadgeVariant = () => {
    if (apiKey.isWorking === false) return "destructive";
    if (apiKey.status === "active") return "default";
    if (apiKey.status === "revoked") return "destructive";
    if (apiKey.status === "expired") return "outline";
    if (apiKey.status === "failing") return "destructive";
    return "secondary";
  };
  
  return (
    <Card className={`overflow-hidden ${apiKey.isWorking === false ? 'border-red-300' : ''}`}>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-base">{apiKey.name}</h3>
              <p className="text-xs text-muted-foreground">
                Service: <span className="capitalize">{apiKey.service}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Added: {formatDate(apiKey.created_at)}
              </p>
            </div>
            
            <div className="flex items-center space-x-1">
              <Badge variant={getBadgeVariant()}>
                {apiKey.status.charAt(0).toUpperCase() + apiKey.status.slice(1)}
              </Badge>
              
              {apiKey.isWorking === false && (
                <AlertCircle className="h-4 w-4 text-destructive ml-1" />
              )}
            </div>
          </div>
          
          <div className="pt-2 border-t mt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="font-mono text-xs bg-muted px-2 py-1 rounded">
                  {formatKeyDisplay(apiKey.key_value, isVisible)}
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={onToggleVisibility}
                  title={isVisible ? "Hide key" : "Show key"}
                >
                  {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onCopy(apiKey.key_value)}
                  title="Copy key"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => onTest(apiKey)}
                  disabled={isTesting}
                >
                  {isTesting ? (
                    <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                  ) : null}
                  Test
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onDelete(apiKey.id)}
                >
                  <Trash className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
