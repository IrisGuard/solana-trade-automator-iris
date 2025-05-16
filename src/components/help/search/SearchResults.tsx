
import React from "react";
import { SearchResultItem } from "./SearchResultItem";
import { useLanguage } from "@/hooks/use-language";

interface SearchResultsProps {
  searchResults: any[];
  searchTerm: string;
  categoryFilter: string | null;
}

export function SearchResults({ searchResults, searchTerm, categoryFilter }: SearchResultsProps) {
  const { t } = useLanguage();
  
  if (searchResults.length === 0 && (searchTerm.trim() !== "" || categoryFilter)) {
    return (
      <p className="text-center text-muted-foreground py-8">
        {t("help.noResourcesFound")}
      </p>
    );
  }
  
  if (searchResults.length > 0) {
    return (
      <>
        <div className="text-sm text-muted-foreground">
          {searchResults.length} {searchResults.length === 1 ? "αποτέλεσμα" : "αποτελέσματα"} 
          {categoryFilter && ` στην κατηγορία "${categoryFilter}"`}
          {searchTerm && ` για "${searchTerm}"`}
        </div>
        {searchResults.map((result, index) => (
          <SearchResultItem key={index} result={result} />
        ))}
      </>
    );
  }
  
  return null;
}
