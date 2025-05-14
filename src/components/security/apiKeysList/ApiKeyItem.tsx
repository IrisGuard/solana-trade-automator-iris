
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ApiKey {
  id: string;
  name: string;
  service: string;
  created_at: string;
  status: string;
  key_value: string;
}

interface ApiKeyItemProps {
  apiKey: ApiKey;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onCopy: (text: string) => void;
  copiedKey: string | null;
  formatDate: (dateString: string) => string;
}

export function ApiKeyItem({
  apiKey,
  isVisible,
  onToggleVisibility,
  onCopy,
  copiedKey,
  formatDate
}: ApiKeyItemProps) {
  const formatKeyDisplay = (key: string, isVisible: boolean) => {
    if (isVisible) {
      return key;
    }
    return key ? `${key.substring(0, 4)}...${key.substring(key.length - 4)}` : '';
  };

  return (
    <div key={apiKey.id} className="flex justify-between items-center p-4 border rounded-md">
      <div>
        <div className="font-medium">{apiKey.name}</div>
        <div className="text-sm text-muted-foreground">Υπηρεσία: {apiKey.service}</div>
        <div className="text-xs text-muted-foreground">Δημιουργήθηκε: {formatDate(apiKey.created_at)}</div>
        {apiKey.key_value && (
          <div className="flex items-center mt-1 space-x-2">
            <Badge variant="outline" className="font-mono text-xs">
              {formatKeyDisplay(apiKey.key_value, isVisible)}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onToggleVisibility}
              title={isVisible ? "Απόκρυψη κλειδιού" : "Εμφάνιση κλειδιού"}
            >
              {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onCopy(apiKey.key_value)}
              title="Αντιγραφή"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      <Button variant="outline" size="sm">Διαχείριση</Button>
    </div>
  );
}
