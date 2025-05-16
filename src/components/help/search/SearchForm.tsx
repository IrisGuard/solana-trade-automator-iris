
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchFormProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  isSearching: boolean;
}

export function SearchForm({ searchTerm, setSearchTerm, handleSearch, isSearching }: SearchFormProps) {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Αναζήτηση οδηγών και πόρων..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>
      <Button onClick={handleSearch} disabled={isSearching}>
        <Search className="h-4 w-4 mr-2" />
        Αναζήτηση
      </Button>
    </div>
  );
}
