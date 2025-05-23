
import React from "react";
import { ExternalLink } from "lucide-react";

interface SearchResultItemProps {
  result: {
    title: string;
    description: string;
    url: string;
    category: string;
    icon?: React.ReactNode;
    iconName?: string;
  };
}

export function SearchResultItem({ result }: SearchResultItemProps) {
  return (
    <div className="border rounded-md p-3 hover:bg-accent transition-colors duration-200 shadow-sm hover:shadow-md">
      <a 
        href={result.url} 
        target={result.url.startsWith("http") ? "_blank" : "_self"}
        rel={result.url.startsWith("http") ? "noopener noreferrer" : ""}
        className="block"
      >
        <div className="flex items-center gap-2">
          {result.icon && <div className="text-primary">{result.icon}</div>}
          <h3 className="font-medium text-primary">{result.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
            {result.category}
          </div>
          {result.url.startsWith("http") && (
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
      </a>
    </div>
  );
}
