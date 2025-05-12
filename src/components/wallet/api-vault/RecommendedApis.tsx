
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface RecommendedApi {
  name: string;
  description: string;
  url: string;
}

interface RecommendedApisProps {
  apis: RecommendedApi[];
}

export function RecommendedApis({ apis }: RecommendedApisProps) {
  const openApiDocs = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="text-sm font-medium mb-2">Προτεινόμενα API για Solana</h4>
      <div className="space-y-2">
        {apis.map((api, index) => (
          <div key={index} className="p-3 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">{api.name}</h5>
                <p className="text-xs text-muted-foreground">{api.description}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => openApiDocs(api.url)}
                title="Άνοιγμα τεκμηρίωσης"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
