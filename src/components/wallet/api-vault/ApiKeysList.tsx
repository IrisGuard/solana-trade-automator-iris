
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, Copy, CheckCircle } from "lucide-react";
import { ApiKey } from "./types";
import { toast } from "sonner";

interface ApiKeysListProps {
  apiKeys: ApiKey[];
  handleApiConnect: (index: number) => void;
  isLoading?: boolean;
  visibleKeyIds?: string[];
  copiedKeyId?: string | null;
  onToggleVisibility?: (id: string) => void;
  onCopyKey?: (value: string, id: string) => void;
}

export function ApiKeysList({
  apiKeys,
  handleApiConnect,
  isLoading = false,
  visibleKeyIds = [],
  copiedKeyId = null,
  onToggleVisibility,
  onCopyKey
}: ApiKeysListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (apiKeys.length === 0) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        <p>Δεν έχετε αποθηκεύσει κλειδιά API.</p>
      </div>
    );
  }
  
  // Handle copy key if no handler is provided
  const handleCopy = (value: string, id: string) => {
    if (onCopyKey) {
      onCopyKey(value, id);
    } else {
      navigator.clipboard.writeText(value);
      toast.success("Το κλειδί αντιγράφηκε στο πρόχειρο");
    }
  };

  return (
    <div className="space-y-2">
      {apiKeys.map((key, index) => {
        const isVisible = visibleKeyIds.includes(key.id);
        const isCopied = copiedKeyId === key.id;
        
        return (
          <div
            key={key.id}
            className="grid grid-cols-[1fr,auto] gap-2 items-center border rounded-md p-2"
          >
            <div className="space-y-1 overflow-hidden">
              <div className="font-medium truncate">{key.name}</div>
              <div className="text-xs text-muted-foreground">
                {key.service}
              </div>
              <div className="flex items-center space-x-2">
                <div className="font-mono bg-muted px-2 py-0.5 rounded text-xs truncate max-w-[200px]">
                  {isVisible ? key.key : "••••••••••••••••••••••••••"}
                </div>
                {onToggleVisibility && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onToggleVisibility(key.id)}
                  >
                    {isVisible ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                    <span className="sr-only">
                      {isVisible ? "Hide" : "Show"} key
                    </span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleCopy(key.key, key.id)}
                >
                  {isCopied ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span className="sr-only">Copy key</span>
                </Button>
              </div>
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApiConnect(index)}
              >
                Connect
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
