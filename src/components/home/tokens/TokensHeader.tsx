
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TokensHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TokensHeader({ searchQuery, onSearchChange }: TokensHeaderProps) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="text-lg font-medium">Tokens</div>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Αναζήτηση token..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
}
