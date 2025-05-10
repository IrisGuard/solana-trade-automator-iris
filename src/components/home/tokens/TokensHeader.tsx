
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";

interface TokensHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TokensHeader({ searchQuery, onSearchChange }: TokensHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <CardTitle>Υπόλοιπο Tokens</CardTitle>
        <CardDescription>Τα Solana SPL tokens σας</CardDescription>
      </div>
      <div className="relative w-full sm:w-auto sm:min-w-[200px]">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Αναζήτηση tokens..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
