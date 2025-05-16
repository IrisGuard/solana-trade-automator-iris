
import React, { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { ExternalLink, Wallet, Bot, Lock, Database, Settings, FileText, BookOpen } from "lucide-react";
import { SearchForm } from "./search/SearchForm";
import { CategoryFilters } from "./search/CategoryFilters";
import { SearchResults } from "./search/SearchResults";
import { SuggestedResources } from "./search/SuggestedResources";
import { allResources, platformHelpResources } from "./search/helpResources";
import { Shield, ArrowsUpDown } from "./search/icons";

export function HelpSearch() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Extract unique categories for filtering
  const categories = Array.from(new Set(allResources.map(resource => resource.category)));
  
  // Function to get the icon component based on icon name
  const getIconByName = (iconName: string) => {
    switch (iconName) {
      case "Wallet": return <Wallet className="h-4 w-4" />;
      case "Bot": return <Bot className="h-4 w-4" />;
      case "Lock": return <Lock className="h-4 w-4" />;
      case "Database": return <Database className="h-4 w-4" />;
      case "Settings": return <Settings className="h-4 w-4" />;
      case "FileText": return <FileText className="h-4 w-4" />;
      case "BookOpen": return <BookOpen className="h-4 w-4" />;
      case "Shield": return <Shield className="h-4 w-4" />;
      case "ArrowsUpDown": return <ArrowsUpDown className="h-4 w-4" />;
      default: return null;
    }
  };
  
  // Transform the resources to include the actual React icon components
  const resourcesWithIcons = platformHelpResources.map(resource => ({
    ...resource,
    icon: getIconByName(resource.iconName)
  }));
  
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
    }).map(resource => {
      // Add the icon component if it exists in the iconName
      if ('iconName' in resource) {
        return {
          ...resource,
          icon: getIconByName(resource.iconName as string)
        };
      }
      return resource;
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
          <SuggestedResources resources={resourcesWithIcons} />
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
