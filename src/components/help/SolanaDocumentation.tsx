
import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { SearchBar } from "./solana/SearchBar";
import { CategoryTabs } from "./solana/CategoryTabs";
import { ResourceResults } from "./solana/ResourceResults";
import { categories, resources } from "./solana/resourceData";

export function SolanaDocumentation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [filteredResources, setFilteredResources] = useState(resources);
  
  // Filter resources when search query or active category changes
  useEffect(() => {
    const filtered = resources.filter(resource => {
      const matchesSearch = 
        searchQuery === "" || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === "all" || resource.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredResources(filtered);
  }, [searchQuery, activeCategory]);

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Τεκμηρίωση και Αναφορές Solana</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Χρήσιμοι σύνδεσμοι και πόροι για την ανάπτυξη εφαρμογών στο Solana blockchain.
          Αυτοί οι σύνδεσμοι χρησιμοποιήθηκαν για την ανάπτυξη της πλατφόρμας και μπορούν
          να λειτουργήσουν ως αναφορά για μελλοντική ανάπτυξη.
        </p>

        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          handleSearch={() => {}} // Not needed anymore as filtering happens in useEffect
        />

        <CategoryTabs 
          categories={categories} 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      <ResourceResults 
        filteredResources={filteredResources} 
        categories={categories} 
        searchQuery={searchQuery}
      />

      <Separator className="my-6" />

      <div className="text-sm text-muted-foreground">
        <p className="mb-2">Οι παραπάνω σύνδεσμοι παρέχονται ως αναφορά και ανήκουν στους αντίστοιχους ιδιοκτήτες τους.</p>
        <p>Η πλατφόρμα δεν φέρει ευθύνη για το περιεχόμενο των εξωτερικών συνδέσμων.</p>
      </div>
    </div>
  );
}
