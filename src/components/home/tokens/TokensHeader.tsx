
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TokensHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TokensHeader({ searchQuery, onSearchChange }: TokensHeaderProps) {
  return (
    <div className="space-y-1.5">
      <h2 className="text-2xl font-semibold tracking-tight">Your Tokens</h2>
      <p className="text-sm text-muted-foreground">
        Manage your Solana SPL tokens and create trading bots
      </p>
      <div className="relative mt-2">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tokens..."
          className="pl-8"
          type="search" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
