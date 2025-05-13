
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ResourceLink } from "./solana/types";
import { helpResources } from "./solana/resources";

export function HelpSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ResourceLink[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Simple search implementation
    const results = helpResources.filter(resource => {
      const term = searchTerm.toLowerCase();
      return (
        resource.title.toLowerCase().includes(term) ||
        resource.description.toLowerCase().includes(term) ||
        resource.category.toLowerCase().includes(term)
      );
    });
    
    setSearchResults(results);
    setIsSearching(false);
  };
  
  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Αναζήτηση βοήθειας..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4 pt-2">
        {searchResults.length === 0 && searchTerm.trim() !== "" ? (
          <p className="text-center text-muted-foreground py-8">
            Δε βρέθηκαν αποτελέσματα για "{searchTerm}"
          </p>
        ) : (
          searchResults.map((result, index) => (
            <div key={index} className="border rounded-md p-3 hover:bg-accent">
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <h3 className="font-medium text-primary">{result.title}</h3>
                <p className="text-sm text-muted-foreground">{result.description}</p>
                <div className="mt-1 text-xs bg-muted inline-block px-2 py-0.5 rounded">
                  {result.category}
                </div>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
