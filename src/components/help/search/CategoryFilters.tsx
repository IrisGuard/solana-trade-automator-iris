
import React from "react";
import { Badge } from "@/components/ui/badge";

interface CategoryFiltersProps {
  categories: string[];
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
}

export function CategoryFilters({ categories, categoryFilter, setCategoryFilter }: CategoryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge 
        variant={categoryFilter === null ? "default" : "outline"}
        className="cursor-pointer"
        onClick={() => setCategoryFilter(null)}
      >
        Όλες οι κατηγορίες
      </Badge>
      {categories.map((category) => (
        <Badge 
          key={category} 
          variant={categoryFilter === category ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setCategoryFilter(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
}
