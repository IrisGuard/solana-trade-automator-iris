
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceCategory } from "./types";

interface CategoryTabsProps {
  categories: ResourceCategory[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <Tabs defaultValue="all" value={activeCategory} onValueChange={onCategoryChange}>
      <TabsList className="mb-4 flex flex-wrap">
        {categories.map(category => (
          <TabsTrigger key={category.id} value={category.id} className="mb-1">
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
