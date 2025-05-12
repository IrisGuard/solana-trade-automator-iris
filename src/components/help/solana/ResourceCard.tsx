
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResourceLink, ResourceCategory } from "./types";

interface ResourceCardProps {
  resource: ResourceLink;
  categories: ResourceCategory[];
}

export function ResourceCard({ resource, categories }: ResourceCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium">
            {resource.title}
          </CardTitle>
          <Badge variant="outline">
            {categories.find(cat => cat.id === resource.category)?.name || resource.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="py-3">
        <p className="text-sm text-muted-foreground mb-3">
          {resource.description}
        </p>
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open(resource.url, "_blank")}
          >
            Άνοιγμα Συνδέσμου
          </Button>
          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
            {resource.url}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
