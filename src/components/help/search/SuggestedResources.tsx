
import React from "react";

interface SuggestedResourcesProps {
  resources: {
    title: string;
    description: string;
    url: string;
    category: string;
    icon?: React.ReactNode;
  }[];
}

export function SuggestedResources({ resources }: SuggestedResourcesProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Προτεινόμενοι πόροι</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {resources.slice(0, 6).map((resource, index) => (
          <div key={index} className="border rounded-md p-3 hover:bg-accent">
            <a 
              href={resource.url} 
              className="block"
            >
              <div className="flex items-center gap-2">
                {resource.icon && <div className="text-primary">{resource.icon}</div>}
                <h3 className="font-medium text-primary text-sm">{resource.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
