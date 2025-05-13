
import React from "react";
import { helpResources, resourceCategories } from "./solana/resources";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SolanaDocumentation() {
  return (
    <div className="p-4 space-y-4">
      <div className="mb-2">
        <h3 className="text-lg font-medium mb-1">Τεκμηρίωση Solana</h3>
        <p className="text-sm text-muted-foreground">
          Χρήσιμοι πόροι και σύνδεσμοι για το οικοσύστημα του Solana
        </p>
      </div>
      
      {resourceCategories.map((category) => {
        const categoryResources = helpResources.filter(
          (resource) => resource.category === category.name
        );
        
        if (categoryResources.length === 0) return null;
        
        return (
          <div key={category.id} className="space-y-2">
            <h4 className="font-medium text-sm flex items-center">
              <Badge variant="outline" className="mr-2">
                {category.name}
              </Badge>
            </h4>
            
            <div className="space-y-2">
              {categoryResources.map((resource, index) => (
                <a 
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="block p-3 border rounded-md hover:bg-accent"
                >
                  <div className="flex justify-between">
                    <h5 className="font-medium text-primary">{resource.title}</h5>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {resource.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
