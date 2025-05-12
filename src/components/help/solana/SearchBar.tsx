
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
}

export function SearchBar({ searchQuery, setSearchQuery, handleSearch }: SearchBarProps) {
  return (
    <div className="flex gap-2 mb-6">
      <div className="relative flex-1">
        <Input
          placeholder="Αναζήτηση τεκμηρίωσης..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
