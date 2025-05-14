
import React, { useState, useMemo } from "react";
import { helpResources, resourceCategories } from "./resources";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/providers/LanguageProvider";

export function SolanaResourceList() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredResources = useMemo(() => {
    return helpResources.filter(resource => {
      const matchesCategory = !selectedCategory || resource.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        resource.description.toLowerCase().includes(searchQuery.toLowerCase());
        
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, helpResources]);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Solana {t("help.documentation")}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t("Explore resources to learn more about Solana blockchain and ecosystem", "Εξερευνήστε πόρους για να μάθετε περισσότερα για το blockchain και το οικοσύστημα του Solana")}
        </p>
        
        <div className="mb-4">
          <Input 
            placeholder={t("Search resources", "Αναζήτηση πόρων")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={!selectedCategory ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              {t("All", "Όλα")}
            </Button>
            
            {resourceCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredResources.map((resource, index) => (
          <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{resource.title}</h4>
              <Badge variant="outline">{resource.category}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              {t("Visit", "Επίσκεψη")} <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        ))}
        
        {filteredResources.length === 0 && (
          <div className="col-span-2 text-center py-8 text-muted-foreground">
            {t("No resources found matching your criteria", "Δεν βρέθηκαν πόροι που να ταιριάζουν με τα κριτήριά σας")}
          </div>
        )}
      </div>
    </div>
  );
}
