
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { RecommendedApi } from "./types";
import { Badge } from "@/components/ui/badge";

interface RecommendedApisProps {
  apis: RecommendedApi[];
}

export function RecommendedApis({ apis }: RecommendedApisProps) {
  const [expandedApis, setExpandedApis] = useState<Record<number, boolean>>({});

  const openApiDocs = (url: string) => {
    window.open(url, '_blank');
  };

  const toggleExpand = (index: number) => {
    setExpandedApis(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="text-sm font-medium mb-2">Recommended Solana APIs</h4>
      <div className="space-y-2">
        {apis.map((api, index) => (
          <div key={index} className="p-3 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h5 className="font-medium">{api.name}</h5>
                <p className="text-xs text-muted-foreground">{api.description}</p>
              </div>
              <div className="flex items-center gap-1">
                {(api.features || api.example) && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => toggleExpand(index)}
                    title="Show more details"
                  >
                    {expandedApis[index] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => openApiDocs(api.url)}
                  title="Open documentation"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {expandedApis[index] && (
              <div className="mt-2">
                {api.features && (
                  <div className="mb-2">
                    <div className="text-xs mb-1 font-medium">Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {api.features.map((feature, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {api.example && (
                  <div>
                    <div className="text-xs mb-1 font-medium">Example:</div>
                    <pre className="text-xs bg-slate-800 text-slate-100 p-2 rounded overflow-x-auto">
                      {api.example}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
