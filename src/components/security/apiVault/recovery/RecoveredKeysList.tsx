
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Eye, EyeOff, Check, Save } from "lucide-react";
import { ApiKey } from "../types";

interface RecoveredKeysListProps {
  keys: ApiKey[];
  onSave?: (keys: ApiKey[]) => void;
}

export const RecoveredKeysList: React.FC<RecoveredKeysListProps> = ({ keys, onSave }) => {
  const [selectedKeys, setSelectedKeys] = useState<{ [key: string]: boolean }>({});
  const [visibleKeys, setVisibleKeys] = useState<{ [key: string]: boolean }>({});
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});
  
  const handleToggleSelect = (id: string) => {
    setSelectedKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleToggleVisibility = (id: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopied(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const handleSaveSelected = () => {
    if (onSave) {
      const keysToSave = keys.filter(key => selectedKeys[key.id]);
      onSave(keysToSave);
    }
  };

  const selectedCount = Object.values(selectedKeys).filter(Boolean).length;

  if (keys.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Ανακτημένα Κλειδιά</h3>
          <p className="text-sm text-muted-foreground">
            Κλειδιά που βρέθηκαν κατά την ανάκτηση
          </p>
        </div>
        {onSave && selectedCount > 0 && (
          <Button 
            onClick={handleSaveSelected}
            className="flex items-center gap-1"
            size="sm"
          >
            <Save className="h-4 w-4" />
            <span>Αποθήκευση {selectedCount}</span>
          </Button>
        )}
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {keys.map((apiKey) => (
          <Card 
            key={apiKey.id}
            className="p-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
          >
            {onSave && (
              <div className="flex items-center h-full">
                <Checkbox 
                  id={`select-${apiKey.id}`}
                  checked={!!selectedKeys[apiKey.id]}
                  onCheckedChange={() => handleToggleSelect(apiKey.id)}
                />
              </div>
            )}
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{apiKey.name || 'Άγνωστο Κλειδί'}</span>
                <span className="bg-muted text-xs px-2 py-1 rounded-full">
                  {apiKey.service}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded text-xs font-mono w-full overflow-hidden text-ellipsis">
                  {visibleKeys[apiKey.id] ? apiKey.key : '•••••••••••••••••••••••••••'}
                </code>
                
                <Button
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleToggleVisibility(apiKey.id)}
                >
                  {visibleKeys[apiKey.id] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                
                <Button
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleCopyKey(apiKey.key, apiKey.id)}
                >
                  {copied[apiKey.id] ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
