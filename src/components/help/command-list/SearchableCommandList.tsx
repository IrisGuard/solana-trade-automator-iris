
import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { CommandCategory } from "./CommandCategory";

interface SearchableCommandListProps {
  filteredCommands: {
    command: string;
    descriptionKey: string;
    details: string;
  }[];
  searchTerm: string;
}

export function SearchableCommandList({ filteredCommands, searchTerm }: SearchableCommandListProps) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm mb-2">Αποτελέσματα αναζήτησης</h4>
      {filteredCommands.length > 0 ? (
        <CommandCategory commands={filteredCommands} t={t} />
      ) : (
        <p className="text-sm text-muted-foreground">Δε βρέθηκαν εντολές που να ταιριάζουν με την αναζήτηση.</p>
      )}
    </div>
  );
}
