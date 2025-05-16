
import React, { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { ExternalLink } from "lucide-react";
import { SearchForm } from "./search/SearchForm";
import { CategoryFilters } from "./search/CategoryFilters";
import { SearchResults } from "./search/SearchResults";
import { SuggestedResources } from "./search/SuggestedResources";
import { allResources, platformHelpResources } from "./search/helpResources";

export function HelpSearch() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Extract unique categories for filtering
  const categories = Array.from(new Set(allResources.map(resource => resource.category)));
  
  const handleSearch = () => {
    if (!searchTerm.trim() && !categoryFilter) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Apply search and category filters
    const results = allResources.filter(resource => {
      const termMatch = !searchTerm.trim() || 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const categoryMatch = !categoryFilter || resource.category === categoryFilter;
      
      return termMatch && categoryMatch;
    });
    
    setSearchResults(results);
    setIsSearching(false);
  };
  
  // Handle search when category or term changes
  React.useEffect(() => {
    handleSearch();
  }, [categoryFilter]);
  
  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium mb-2">{t("help.searchResources")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("help.exploreResources")}
        </p>
      </div>
      
      <SearchForm 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        isSearching={isSearching}
      />
      
      <CategoryFilters
        categories={categories}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />
      
      <div className="space-y-4 pt-2">
        {searchResults.length === 0 && (searchTerm.trim() === "" && !categoryFilter) ? (
          <SuggestedResources resources={platformHelpResources} />
        ) : (
          <SearchResults 
            searchResults={searchResults}
            searchTerm={searchTerm}
            categoryFilter={categoryFilter}
          />
        )}
      </div>
    </div>
  );
}
